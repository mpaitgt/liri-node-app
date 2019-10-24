require("dotenv").config();

var fs = require('fs');
var keys = require("./keys.js");
var axios = require('axios');
var moment = require('moment');
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);
var searchType = process.argv[2];
var userSearch = process.argv[3];

switch (searchType) {
    case 'concert-this':
        getTourDates();
    break;
    case 'spotify-this-song':
        getThisSong();
    break;
    case 'movie-this':
        getMovies();
    break;
    case 'do-what-it-says':

    break;
}

function getTourDates() {
    var bandsInTownURL = 'https://rest.bandsintown.com/artists/' + userSearch + '/events?app_id=codingbootcamp';
    axios.get(bandsInTownURL).then(function(response) {
        var tourInfo = response.data;
        for (var i = 0; i < tourInfo.length; i++) {
            var date = moment(tourInfo[i].datetime).format('MM/DD/YYYY');
            var time = moment(tourInfo[i].datetime).format('h:MM a');
            var venue = tourInfo[i].venue.name;
            var city = tourInfo[i].venue.city;
            var state = tourInfo[i].venue.region;
            var country = tourInfo[i].venue.country;
            if (state === '') {
                console.log(date + ' at ' + time + ' - ' + venue + ' in ' + city + ', ' + country);
            } else {
                console.log(date + ' at ' + time + ' - ' + venue + ' in ' + city + ', ' + state);
            }
        }
    })
}

function getMovies() {
    var omdbURL = 'http://www.omdbapi.com/?apikey=trilogy&t=' + userSearch;
    axios.get(omdbURL).then(function(response) {
        var movieInfo = response.data;
        var title = movieInfo.Title;
        var releaseYear = movieInfo.Year;
        var imdbRating = movieInfo.imdbRating;
        var rotten = movieInfo.Ratings[1].Source;
        var rottenRating = movieInfo.Ratings[1].Value;   
        var country = movieInfo.Country;
        var lang = movieInfo.Language;
        var plot = movieInfo.Plot;
        var actors = movieInfo.Actors;
        console.log(title);
        console.log('Released in ' + releaseYear);
        console.log('IMDB rating of ' + imdbRating);
        console.log(rotten + ' Rating: ' + rottenRating);
        console.log('Produced in ' + country);
        console.log('Language: ' + lang);
        console.log('Plot summary: ' + plot);
        console.log('Cast: ' + actors);
    })
}

function getThisSong() {
    spotify.search({ 
        type: 'track', 
        query: userSearch 
    }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
      console.log("Artist: " + data.tracks.items[0].artists[0].name); 
      console.log("Song Name: " + data.tracks.items[0].name); 
      console.log("Preview: " + data.tracks.items[0].preview_url); 
      console.log("Album: " + data.tracks.items[0].album.name); 
      });
}