require("dotenv").config();
var Spotify = require('node-spotify-api');
var moment = require('moment');
var inquirer = require('inquirer');
var axios = require('axios');
var keys = require('./keys.js');
var spotify = new Spotify(keys.spotify);

function liriINIT(){
    inquirer.prompt([
        {
            name: 'command',
            message: "Which command would you like to run?",
            type: 'rawlist',
            choices: ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says', 'Exit']
        }
    ]).then(response => {
        switch(response.command){
            case 'concert-this':
                concertThis();
                break;
            case 'spotify-this-song':
                spotifyThisSong();
                break;
            case 'movie-this':
                movieThis();
                break;
            case 'do-what-it-says':
                doWhatItSays();
                break;
            case 'Exit':
                console.log('Goodbye');
                return;
        }
    }).catch(err => {
        console.log(err);
    });
}

function spotifyThisSong(){
    inquirer.prompt([
        {
            name: 'song',
            message: "What song would you like to search for?",
            type: 'input',
            default: 'The Sign - Ace of Base',
        }
    ]).then(response => {
        spotify.search({
            type: 'track',
            query: response.song,
            limit: 5
        }).then(res => {
            if(res.tracks.items.length > 0){
                res.tracks.items.forEach(song => {
                    var artistList = [];
                    song.artists.forEach(artist => {
                        artistList.push(artist.name);
                    });
                    console.log('\n```````````````\nSong Name: ' + song.name + "\nArtist(s): " + artistList.join(', ') + "\nPreview Link: " + song.preview_url + " \nAlbum: " + song.album.name + "\n\n```````````````\n");
                });
                liriINIT();
            }else{
                console.log('That does not return any results');
                liriINIT();
            }
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });
}

function concertThis(){
    inquirer.prompt([
        {
            name: 'artist',
            message: "What artist do you want to search for?",
            type: "input"
        }
    ]).then(res => {
        var artist = res.artist.split(' ').join('+');
        axios.get('https://rest.bandsintown.com/artists/'+ artist + '/events?app_id=codingbootcamp').then(res => {
            if(res.data.length > 0){
                res.data.forEach(concert => {
                    console.log("\n```````````````\nVenue Name: " + concert.venue.name + "\nVenue Location: " + concert.venue.city + "\nDate: " + moment(concert.datetime).format("dddd, MMMM Do YYYY, h:mm:ss a") + "\n\n```````````````\n");
                });
                liriINIT();
            }else{
                console.log("There are no upcoming shows");
                liriINIT();
            }
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    });
}


liriINIT();