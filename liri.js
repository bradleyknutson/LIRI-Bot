require("dotenv").config();
var Spotify = require('node-spotify-api');
var moment = require('moment');
var inquirer = require('inquirer');
var axios = require('axios');
var keys = require('./keys.js');
var spotify = new Spotify(keys.spotify);
var fs = require('fs');

function liriINIT(){
    inquirer.prompt([
        {
            name: 'command',
            message: "Which command would you like to run?",
            type: 'rawlist',
            choices: ['Search for concerts by Artist', 'Search for a song by the title', 'Search for a movie by the title', 'Do something random!', 'Exit']
        }
    ]).then(response => {
        logData(`${moment().format()} ${response.command} selected`)
        switch(response.command){
            case 'Search for concerts by Artist':
                concertThis();
                break;
            case 'Search for a song by the title':
                spotifyThisSong();
                break;
            case 'Search for a movie by the title':
                movieThis();
                break;
            case 'Do something random!':
                doWhatItSays();
                break;
            case 'Exit':
                console.log('Goodbye');
                return;
        }
    }).catch(err => {
        logData(`${moment().format()} ${err}`);;
    });
}

function spotifyThisSong(song){
    inquirer.prompt([
        {
            name: 'song',
            message: "What song would you like to search for?",
            type: 'input',
            default: song || 'The Sign - Ace of Base',
        }
    ]).then(response => {
        logData(`${moment().format()} ${response.song} Entered`);
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
            logData(`${moment().format()} ${err}`);;
        });
    }).catch(err => {
        logData(`${moment().format()} ${err}`);;
    });
}

function concertThis(artist){
    inquirer.prompt([
        {
            name: 'artist',
            message: "What artist do you want to search for?",
            type: "input",
            default: artist || "Amon Amarth"
        }
    ]).then(res => {
        logData(`${moment().format()} ${res.artist} Entered`);
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
            console.log(err.response.data.errorMessage);
            logData(`${moment().format()} ${err.response.data.errorMessage}`);
            liriINIT();
        })
    }).catch(err => {
        logData(`${moment().format()} ${err}`);
    });
}

function movieThis(movie){
    inquirer.prompt([
        {
            name: 'movie',
            message: "What movie would you like to search for?",
            type: 'input',
            default: movie || "Mr. Nobody"
        }
    ]).then(res => {
        logData(`${moment().format()} ${res.movie} Entered`);
        var movieSearch = res.movie.split(' ').join('+');
        var movieTitle = "";
        axios.get("http://www.omdbapi.com/?apikey=3cb42b54&s=" + movieSearch).then(res => {
            movieTitle = res.data.Search[0].Title;
        }).catch(err =>{
            logData(`${moment().format()} ${err}`);
        }).finally(() => {
            if(movieTitle !== ""){
                axios.get("http://www.omdbapi.com/?apikey=3cb42b54&t=" + movieTitle).then(res => {
                    var movie = res.data;
                    var movieData = [
                        `Title: ${movie.Title}`,
                        `Year: ${movie.Year}`,
                        `IMDB Rating: ${movie.Ratings[0] ? movie.Ratings[0].Value : "None"}`,
                        `Rotten Tomatoes Rating: ${movie.Ratings[1] ? movie.Ratings[1].Value : "None"}`,
                        `Country: ${movie.Country}`,
                        `Language: ${movie.Language}`,
                        `Plot: ${movie.Plot}`,
                        `Actors: ${movie.Actors}`
                    ].join("\n");
                    console.log("```````````````\n" + movieData + "\n```````````````");
                    liriINIT();
                }).catch(err =>{
                    logData(`${moment().format()} ${err}`);
                });
            }else{
                console.log('No movie exists with that name');
                logData('No movie exists with that name');
                liriINIT();
            }

        });
    }).catch(err =>{
        logData(`${moment().format()} ${err}`);
    });
}

function doWhatItSays(){
    fs.readFile('random.txt', 'utf8', (err, data) => {
        if(err) throw err;
        var commandLines = data.split('\n');
        var randomCommand = commandLines[Math.floor(Math.random() * commandLines.length)];
        var commandArgs = randomCommand.split(',');
        var command = commandArgs[0];
        var argument = commandArgs[1].replace(/"/g,"");
        switch(command){
            case "spotify-this-song":
                spotifyThisSong(argument);
                break;
            case "concert-this":
                concertThis(argument);
                break;
            case "movie-this":
                movieThis(argument);
        }
    });
}

function logData(message){
    fs.appendFile('log.txt', `\n${message}`, 'utf8', (err) => {
        if(err) throw err;
    });
}

logData(`LIRI Loaded`);
liriINIT();