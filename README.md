# LIRI-Bot

## Description
LIRI-Bot is a Language Interpretation and Recognition Interface bot, used exclusively to search for concerts, songs, and movies.  In this version of the bot you initialize the program and then choose your search options from Inquirer.  

## Installation
* run `npm i` to install dependencies
* create .env that contains the following:
* * SPOTIFY_ID=[`Your Spotify ID`]
* * SPOTIFY_SECRET=[`Your Spotify Secret`]

## Usage
* run `node liri.js` to initialize the bot.
* Choose between the various options using the arrow keys or numbered index.

## Demo
[Demo Video Here](https://github.com/bradleyknutson/LIRI-Bot/blob/master/demo.mp4)

## Frameworks Used
* ### npm
* * node-spotify-api
* * moment
* * inquirer
* * axios
* * dotenv

* ### libraries
* * fs

* ### APIs
* * [OMDB API](http://www.omdbapi.com)
* * [Bands In Town API](http://www.artists.bandsintown.com/bandsintown-api)

## Roadmap
* More robust searching for all terms
* Storing data from each and using them in each other, such as finding the artist of a song and calling to see if there are any concerts nearby.
* Add additional APIs for searching