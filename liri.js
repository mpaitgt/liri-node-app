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

function getTourDates(band) {
    var bandsInTownURL = 'https://rest.bandsintown.com/artists/' + band + '/events?app_id=codingbootcamp';
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
                console.log(`${date} at ${time} - ${venue} in ${city}, ${country}`);
            } else {
                console.log(`${date} at ${time} - ${venue} in ${city}, ${state}`);
            }
        }
    })
}

function getMovies(movie) {
    var omdbURL = 'http://www.omdbapi.com/?apikey=trilogy&t=' + movie;
    axios.get(omdbURL).then(function(response) {
        var movieInfo = response.data;
        console.log(movieInfo.Title);
        console.log('Released in ' + movieInfo.Year);
        console.log('IMDB rating of ' + movieInfo.imdbRating);
        console.log(movieInfo.Ratings[1].Source + ' Rating: ' + movieInfo.Ratings[1].Value);
        console.log('Produced in ' + movieInfo.Country);
        console.log('Language: ' + movieInfo.Language);
        console.log('Plot summary: ' + movieInfo.Plot);
        console.log('Cast: ' + movieInfo.Actors);
    })
}

function getThisSong(song) {
    spotify.search({ 
        type: 'track', 
        query: song 
    }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        var spotifyReturn = data.tracks.items;
        for (var i = 0; i < spotifyReturn.length; i++) {
            console.log("Artist: " + data.tracks.items[i].artists[0].name); 
            console.log("Song Name: " + data.tracks.items[i].name); 
            console.log("Preview: " + data.tracks.items[i].preview_url); 
            console.log("Album: " +data.tracks.items[i].album.name); 
            console.log('-----------------------------------------------------');
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
