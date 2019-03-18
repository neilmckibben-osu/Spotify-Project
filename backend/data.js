// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Create tyoe that holds the Artist name, ranking, popularity, and url to the artist
// this will be our data base's data structure 
const DataSchema = new Schema(
  {
    id: spotifyUserID,
    topArtistInfo: {
                        1:{
                            artistName: name,
                            artistPopularity: popularity,
                            artistUrl = url
                        },
                        2:{
                            artistName: name,
                            artistPopularity: popularity,
                            artistUrl = url
                        },
                        3:{
                            artistName: name,
                            artistPopularity: popularity,
                            artistUrl = url
                        },
                        4:{
                            artistName: name,
                            artistPopularity: popularity,
                            artistUrl = url
                        },
                        5:{
                            artistName: name,
                            artistPopularity: popularity,
                            artistUrl = url
                        },
                        6:{
                            artistName: name,
                            artistPopularity: popularity,
                            artistUrl = url
                        },
                        7:{
                            artistName: name,
                            artistPopularity: popularity,
                            artistUrl = url
                        },
                        8:{
                            artistName: name,
                            artistPopularity: popularity,
                            artistUrl = url
                        },
                        9:{
                            artistName: name,
                            artistPopularity: popularity,
                            artistUrl = url
                        },
                        10:{
                            artistName: name,
                            artistPopularity: popularity,
                            artistUrl = url
                        }
                   }

  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Data", DataSchema);