require("dotenv").config();

var keys = require("./key.js");
var fs = require("fs");
var inquirer = require("inquirer");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var spotify = new Spotify(keys.spotify);
var moment = require("moment");
var userSearch;
var divider = "\n------------------------------------------------------------\n\n";


inquirer
  .prompt([
    {
      type: "list",
      message: "Select a command",
      choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
      name: "command",
    }
  ])
  .then(answers => {
    //if answer is spotify
    if (answers.command == "spotify-this-song") {
      inquirer
        .prompt([
          {
            type: "input",
            message: "Type the name of a song",
            default: "The Sign",
            name: "spotifyArtist",
          }
        ])
        .then(answers => {
          userSearch = answers.spotifyArtist;
          runSpotify();
        });
    }

    //if answer is concert
    if (answers.command == "concert-this") {
      inquirer
        .prompt([
          {
            type: "input",
            message: "Type the name of a Band or Artist",
            default: "Drake",
            name: "concertArtist",
          }
        ])
        .then(answers => {
          userSearch = answers.concertArtist;
          runConcert();
        });
    }

    //if answer is movie
    if (answers.command == "movie-this") {
      inquirer
        .prompt([
          {
            type: "input",
            message: "Type the name of a Movie",
            default: "Mr. Nobody",
            name: "movie",
          }
        ])
        .then(answers => {
          userSearch = answers.movie;
          runMovie();
        });
    }

    //if answer is do what
    if (answers.command == "do-what-it-says") {
          userSearch = "I Want it That Way"
          runRandom();
        };
    

  })

//function to run Spotify search

function runSpotify() {
  spotify
    .search({ type: 'track', query: userSearch, limit: 1 })
    .then(function (response) {
      for (let i = 0; i < response.tracks.items.length; i++) {
        var spotifyData = [
          "Artist:" + response.tracks.items[i].album.artists[0].name,
          "Song Name:" + response.tracks.items[i].name,
          "Album:" + response.tracks.items[i].album.name,
          "Link:" + response.tracks.items[i].album.artists[0].external_urls.spotify
        ].join("\n\n");
        console.log(spotifyData);
        fs.appendFile("log.txt", spotifyData + divider, function (err) {
          if (err) throw err;

        });
      }
    })
    .catch(function (err) {
      console.log(err);

    })
}

//function to run concert search
function runConcert() {
  var URL = "https://rest.bandsintown.com/artists/" + userSearch + "/events?app_id=codingbootcamp";

  axios.get(URL).then(function (response) {
    for (let j = 0; j < response.data.length; j++) {
      var concertData = [
        "Venue:" + response.data[j].venue.name,
        "Location:" + response.data[j].venue.city, response.data[j].venue.region,
        "Date:" + moment(response.data[j].datetime).format("MM/DD/YYYY")
      ].join("\n\n");
      console.log(concertData);
      fs.appendFile("log.txt", concertData + divider, function (err) {
        if (err) throw err;
      })
    }
  })
}

//function to run move search
function runMovie(){
  var URL = "http://www.omdbapi.com/?t=" + userSearch + "&apikey=trilogy";

  axios.get(URL).then(function (response) {
      var movieData = [
        "Title:" + response.data.Title,
        "Release Year:" + response.data.Year,
        "IMDB Rating:" + response.data.imdbRating,
        "Rotten Tomatoes Rating:" + response.data.Ratings[1].Value,
        "Country:" + response.data.Country,
        "Language:" + response.data.Language,
        "Plot:" + response.data.Plot,
        "Actors:" + response.data.Actors,
      ].join("\n\n");
      console.log(movieData);
      fs.appendFile("log.txt", movieData + divider, function (err) {
        if (err) throw err;
      })
    
  })
}

//functions to read file
function runRandom() {
  fs.readFile("random.txt", "utf8", function (error, data) {
      if (error) {
          console.log(error);
      }
          runSpotify();
  });
}