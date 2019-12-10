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
            limit: 1
        }).then(res => {
            if(res.tracks.items.length > 0){
                var song = res.tracks.items[0];
                var artists = [];
                song.artists.forEach(artist => {
                    artists.push(artist.name);
                });
                console.log('\n```````````````\nSong Name: ' + song.name + "\nArtist(s): " + artists.toString() + "\nPreview Link: " + song.preview_url + " \nAlbum: " + song.album.name + "\n\n```````````````\n");
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




liriINIT();