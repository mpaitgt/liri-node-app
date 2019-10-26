require("dotenv").config();
var fs = require('fs');
var keys = require("./keys.js");
var axios = require('axios');
var moment = require('moment');
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);
var searchType = process.argv[2];
var userSearch = process.argv.slice(3).join(' ');

switch (searchType) {
    case 'concert-this':
        getTourDates(userSearch);
    break;
    case 'spotify-this-song':
        getThisSong(userSearch);
    break;
    case 'movie-this':
        getMovies(userSearch);
    break;
    case 'do-what-it-says':
        doThis();
    break;
}

function getTourDates(input) {
    var bandsInTownURL = 'https://rest.bandsintown.com/artists/' + input + '/events?app_id=codingbootcamp';
    axios.get(bandsInTownURL).then(function(response) {
        var tourInfo = response.data;
        myLog(`\n${searchType}`);
        for (var i = 0; i < tourInfo.length; i++) {
            var date = moment(tourInfo[i].datetime).format('MM/DD/YYYY');
            var time = moment(tourInfo[i].datetime).format('h:MM a');
            var venue = tourInfo[i].venue.name;
            var city = tourInfo[i].venue.city;
            var state = tourInfo[i].venue.region;
            var country = tourInfo[i].venue.country;
            if (state === '') {
                myLog(`${date} at ${time} - ${venue} in ${city}, ${country}`);
            } else {
                myLog(`${date} at ${time} - ${venue} in ${city}, ${state}`); 
            }
        }
    })
}

function getMovies(input) {
    var omdbURL = 'http://www.omdbapi.com/?apikey=trilogy&t=' + input;
    axios.get(omdbURL).then(function(response) {
        var movieInfo = response.data;
        var title = movieInfo.Title;
        var year = movieInfo.Year;
        var imdbRating = movieInfo.imdbRating;
        var rotten = movieInfo.Ratings[1].Source;
        var rottenRating = movieInfo.Ratings[1].Value;
        var country = movieInfo.Country;
        var lang = movieInfo.Language
        var plot = movieInfo.Plot
        var actors = movieInfo.Actors;
        myLog(`\n${searchType}`);
        myLog(`${title}\nReleased in ${year}\nIMDB rating of ${imdbRating}\n${rotten} Rating: ${rottenRating}\nProduced in ${country}\nLanguage: ${lang}\nPlot summary: ${plot}\nCast: ${actors}`);
    })
}

function getThisSong(input) {
    spotify.search({ 
        type: 'track', 
        query: input 
    }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        var spotifyReturn = data.tracks.items;
        myLog(`\n${searchType}`);
        for (var i = 0; i < 5; i++) {
            var artist = data.tracks.items[i].artists[0].name;
            var song = data.tracks.items[i].name;
            var preview = data.tracks.items[i].preview_url;
            var album = data.tracks.items[i].album.name;
            myLog(`Artist: ${artist}\nSong Name: ${song}\nPreview: ${preview}\nAlbum: ${album}\n---------------------------------------------------\n`);
        }
      });
}

function doThis() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
          }
        var newCommand = data.split(' ');
        var newSearch = newCommand[0];
        var newInput = newCommand.slice(1).join(' ');

        switch(newSearch) {
            case 'concert-this':
                getTourDates(newInput);
            break;
            case 'spotify-this-song':
                getThisSong(newInput);
            break;
            case 'movie-this':
                getMovies(newInput);
            break;
        }
    })
}

function myLog(message) {
    console.log(message);
    fs.appendFile('log.txt', `${message}\n`, function(err) {
        if (err) {
            return console.log(err);
        }
    })
}