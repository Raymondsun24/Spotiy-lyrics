
const express = require('express');
const fetch = require("node-fetch");
const app = express();
const axios = require('axios');
const zlib = require("zlib");
const solenolyrics= require("solenolyrics"); 
const path = require("path");
const cors = require("cors");
var querystring = require('querystring');
app.use(express.json()).use(cors());

app.use('/public', express.static(path.join(__dirname,'static')));

app.get('/', (req,res)=>{
    res.send(JSON.stringify({status:200,
                            msg: 'OK'}));
});

const my_client_id = '240cd0ccc20e40e087947ffa1c710b42';
const my_client_secret = '43114a60e9374d0f9e7dfaba22ba11e9';

const redirect_uri = 'https://shrouded-escarpment-08729.herokuapp.com/login/redirect'
app.get('/login', function(req, res) {
	var scopes = 'user-read-playback-state user-read-currently-playing';
	res.redirect('https://accounts.spotify.com/authorize' +
	  '?response_type=code' +
	  (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
	  '&client_id=' + my_client_id +
	  '&redirect_uri=' + encodeURIComponent(redirect_uri));
});

app.get('/login/redirect', (req, res) => {
	let auth_code = req.query.code;
	let options = {
		method: 'post',
		url: 'https://accounts.spotify.com/api/token',
		params: {
			grant_type: 'authorization_code',
			code: auth_code,
			redirect_uri: redirect_uri,
		},
		headers:{
			'Content-Type': 'application/x-www-form-urlencoded',
			"Authorization": "Basic MjQwY2QwY2NjMjBlNDBlMDg3OTQ3ZmZhMWM3MTBiNDI6NDMxMTRhNjBlOTM3NGQwZjllN2RmYWJhMjJiYTExZTk="
		}
	}
	axios(options).then(response=>{
		let data = response.data;
		let access_token = data.access_token;
		let refresh_token = data.refresh_token;
		let expires_in = data.expires_in;

		// Send the tokens to the web browser
		res.redirect('/lyrics' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
        }));
		// Do the request here
		// let options = {
		// 	method: 'GET',
  //        	headers: { 'Authorization': 'Bearer ' + access_token }
		// };
		// fetch('https://api.spotify.com/v1/me/player/currently-playing', options).then(response=>{
		// 	if(response.statusText == "OK" && response.status >= 200 && response.status < 300){
		// 		return response.json();
		// 	}else throw new Error("No song is playing");
		// }).then((data)=>{
		// 	solenolyrics.requestLyricsFor(data.item.name).then(lyr=>{res.send(lyr)})
		// }).catch(err=>{res.send(err.message)});
	});
});

app.get('/refresh_token', (req, res)=>{
	let refresh_token = req.query.refresh_token;
	let options = {
		method: 'get',
		url: 'https://accounts.spotify.com/api/token',
		params: {
			grant_type: 'refresh_token',
			refresh_token: refresh_token
		},
		headers:{
			'Content-Type': 'application/x-www-form-urlencoded',
			"Authorization": "Basic MjQwY2QwY2NjMjBlNDBlMDg3OTQ3ZmZhMWM3MTBiNDI6NDMxMTRhNjBlOTM3NGQwZjllN2RmYWJhMjJiYTExZTk="
		}
	}
	axios(options).then(response=>{
		// use the access token to access the Spotify Web API
		//       request.get(options, function(error, response, body) {
		//         console.log(body);
		//       });
	});

});

app.get('/lyrics', (req, res)=>{
	res.sendFile(path.join(__dirname,'static', 'lyrics.html'));
})

app.get('/test', (req, res) => {res.sendFile(path.join(__dirname,'static', 'index.html'))});

app.get('/abc', (req, res)=>{
	console.log("Hello");
	res.redirect('/redir');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT);

