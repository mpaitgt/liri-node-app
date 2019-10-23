require("dotenv").config();

var keys = require("./keys.js");
var axios = require('axios');
var moment = require('moment');

// var spotify = new Spotify(keys.spotify);
var artist = process.argv[2];
var queryURL = 'https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp';

axios.get(queryURL).then(function(response) {
    var tourInfo = response.data;
    var date = moment(tourInfo[1].datetime).format('MMMM Do YYYY');
    var time = moment(tourInfo[1].datetime).format('h:MM a');
    var venue = tourInfo[1].venue.name;
    var city = tourInfo[1].venue.city;
    var state = tourInfo[1].venue.region;

    console.log(date + ' at ' + time + ' - ' + venue + ' in ' + city + ', ' + state);
})