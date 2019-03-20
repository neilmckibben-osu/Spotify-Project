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
      id: 0,
      message: null,
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
  
  TopArtistInfo(name, ranking, popularity, url)
  {
    this.name = name;
    this.ranking = ranking;
    this.popularity = popularity;
    this.url = url;
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
          Top Artist: { this.state.topArtists.one}
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
        <ul>
          {this.topArtistMap}
        </ul>
      </div>
    );
  }
}

export default App;