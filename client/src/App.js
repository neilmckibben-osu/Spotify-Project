import React, { Component } from 'react';
import './App.css';
import * as SpotifyWebApi from 'spotify-web-api-js';
import axios from "axios";

//Create tyoe that holds the Artist name, ranking, popularity, and url to the artist

const spotifyApi = new SpotifyWebApi();
class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      data: [],
      id: 'null',
      topArtistInfo: {
        1:{ name: String, pop: Number, url: String },
        2:{ name: String, pop: Number, url: String },
        3:{ name: String, pop: Number, url: String },
        4:{ name: String, pop: Number, url: String },
        5:{ name: String, pop: Number, url: String },
        6:{ name: String, pop: Number, url: String },
        7:{ name: String, pop: Number, url: String },
        8:{ name: String, pop: Number, url: String },
        9:{ name: String, pop: Number, url: String },
        10:{ name: String, pop: Number, url: String }
   },
      intervalIsSet: false,
      idToDelete: null,
      idToUpdate: null,
      objectToUpdate: null,
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
    }
  }

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has 
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever 
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }
  
  // just a note, here, in the front end, we use the id key of our data object 
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify 
  // data base entries

  // our first get method that uses our backend api to 
  // fetch data from our data base
  getDataFromDb = () => {
    fetch("http://localhost:3001/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = topArtistInfo => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = this.state.id;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("http://localhost:3001/api/putData", {
      id: idToBeAdded,
      topArtistInfo: topArtistInfo
    });
  };


  // our delete method that uses our backend api 
  // to remove existing database information
  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id == idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("http://localhost:3001/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };


  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("http://localhost:3001/api/updateData", {
      id: objIdToUpdate,
      update: { topArtistInfo: updateToApply }
    });
  };
  
  TopArtistInfo(ArtistName, artistRanking, artistPopularity, artistUrl)
  {
    this.setState({
      topArtistInfo: {
        artistRanking:{ 
          name: ArtistName, 
          pop: artistPopularity, 
          url: artistUrl 
        }
      }    
    });

  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getUserID(){
    spotifyApi.getMe()
      .then((response) => {
        this.setState({
          id: response.id
        });
      })
  }

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              name: response.item.name, 
              albumArt: response.item.album.images[0].url
            }
        });
      })
  }

  getTopArtist(maxArtists, timeRange){
    spotifyApi.getMyTopArtists({limit: maxArtists, offset: 0, time_range: timeRange})
      .then((response) => {
        this.setState({
          topArtists: { 
              one: response.items[0].name
            }
        });
        for(var i = 0; i < maxArtists; i++)
        {
          var artistInfo = {name: response.items[i].name, rank: i, popularity: response.items[i].popularity, artistUrl: response.items[i].external_urls}
          this.topArtistInfo.set(i, artistInfo)
        }
      })    
  }
  render() {
    return (
      <div className="App">
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
        </div>
        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        }
        { this.state.loggedIn &&
          <button onClick={() => this.getTopArtist(20, 'medium_term')}>
            Check Top Artist
          </button>
        }
      </div>
    );
  }
}

export default App;