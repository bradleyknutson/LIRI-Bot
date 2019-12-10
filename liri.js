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
            choices: ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says']
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
        }
    }).catch(err => {
        console.log(err);
    });
}


function concertThis(){
    console.log('hello there');
}

liriINIT();