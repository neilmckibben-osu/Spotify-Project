// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Create tyoe that holds the Artist name, ranking, Number, and url to the artist
// this will be our data base's data structure 
const DataSchema = new Schema(
  {
    id: String,
    topArtistInfo: {
                        1:{
                            name: String,
                            pop: Number,
                            url: String
                        },
                        2:{
                            name: String,
                            pop: Number,
                            url: String
                        },
                        3:{
                            name: String,
                            pop: Number,
                            url: String
                        },
                        4:{
                            name: String,
                            pop: Number,
                            url: String
                        },
                        5:{
                            name: String,
                            pop: Number,
                            url: String
                        },
                        6:{
                            name: String,
                            pop: Number,
                            url: String
                        },
                        7:{
                            name: String,
                            pop: Number,
                            url: String
                        },
                        8:{
                            name: String,
                            pop: Number,
                            url: String
                        },
                        9:{
                            name: String,
                            pop: Number,
                            url: String
                        },
                        10:{
                            name: String,
                            pop: Number,
                            url: String
                        }
                   }

  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Data", DataSchema);