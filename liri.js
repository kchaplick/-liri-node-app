require('dotenv').config()
var keys = require("./key.js");
var spotify = new Spotify(key.spotify);
var axios = require("axios");
let userSearch = process.argv[3]

spotify
  .search({ type: 'track', query: userSearch })
  .then(function(response) {
    console.log(response);
  })
  .catch(function(err) {
    console.log(err);
  });