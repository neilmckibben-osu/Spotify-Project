import React, { Component } from 'react';
import './App.css';
import * as SpotifyWebApi from 'spotify-web-api-js';

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
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      topArtists: { one: 'Not checked'}
    }
    var topArtistMap = new Map();
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