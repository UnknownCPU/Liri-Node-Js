require('dotenv').config();
var latestTweets = require('latest-tweets');
var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var userInput = process.argv[2];
var mediaChoice = process.argv[3];
console.log('this is a command: ' + userInput)

function liri(userInput, mediaChoice) {
	switch (userInput) {
		case 'my-tweets':
			getTweets();
			break;
		case 'spotify-this-song':
			spotifySong(mediaChoice);
			break;
		case 'movie-this':
			printMovie(mediaChoice);
			break;
		case 'do-what-it-says':
			whatItSays();
			break;
		default:
			console.log('Command unknown.');
			break;
	}
};

function printMovie(movie) {
	movie = movie || 'Mr. Nobody';
	request('http://www.omdbapi.com/?t=' + mediaChoice + '&y=&plot=short&apikey=trilogy', function(error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log('Movie: ' + JSON.parse(body).Title);
			console.log('Year: ' + JSON.parse(body).Year);
			console.log('IMDB Rating: ' + JSON.parse(body).imdbRating);
			console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value);
			console.log('Country: ' + JSON.parse(body).Country);
			console.log('Language: ' + JSON.parse(body).Language);
			console.log('Plot: ' + JSON.parse(body).Plot);
			console.log('Actors: ' + JSON.parse(body).Actors);
		}
	});
}

function spotifySong(song) {
	song = song || 'The Sign by Ace of Base';
	spotify.search({
		type: 'track',
		query: song,
		limit: 1
	}, function(error, data) {
		if (error) {
			return console.log('Error Occurred: ' + error);
		}
		console.log('Song’s Name: ' + data.tracks.items[0].name);
		console.log('Artist(s): ' + data.tracks.items[0].artists[0].name);
		console.log('Spotify Link Preview: ' + data.tracks.items[0].preview_url);
		console.log('Song’s Name: ' + data.tracks.items[0].album.name);
	});
}

function whatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return console.log("Error:" + error);
		}
		liri((data.split(",")[0]), (data.split(",")[1]));
	});
}

function getTweets() {
	client.get('statuses/user_timeline', {
		status: "I am a tweet"
	}, function(error, tweets, response) {
		if (!error) {
			for (var i = 0; i < tweets.length; i++) {
				console.log(tweets[i].text);
				fs.appendFile('log.txt', "my-tweets: " + tweets[i].text + "\n", function(err) {
					if (err) throw err;
				});
			}
		}
	});
}
liri(userInput, mediaChoice);