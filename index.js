
const express = require('express');
const fetch = require("node-fetch");
const app = express();


app.use(express.json());

app.get('/', (req,res)=>{
    res.send(JSON.stringify({status:200,
                            msg: 'OK'}));
});

const my_client_id = '240cd0ccc20e40e087947ffa1c710b42';
const my_client_secret = '43114a60e9374d0f9e7dfaba22ba11e9';

const redirect_uri = 'https://shrouded-escarpment-08729.herokuapp.com/login/redirect'
app.get('/login', function(req, res) {
	var scopes = 'user-read-private user-read-email';
	res.redirect('https://accounts.spotify.com/authorize' +
	  '?response_type=code' +
	  (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
	  '&client_id=' + my_client_id +
	  '&redirect_uri=' + encodeURIComponent(redirect_uri));
});

app.get('/login/redirect', (req, res) => {
	res.send(req.query);
	let auth_code = req.query.code;
	let options = {
		method: 'POST',
		data: {
			grant_type: express.urlencoded('authorization_code'),
			code: express.urlencoded(auth_code),
			redirect_uri: express.urlencoded(redirect_uri),
		},
		headers:{
			"Content-Type": "application/x-www-form-urlencoded",
			"Authorization": "Basic MjQwY2QwY2NjMjBlNDBlMDg3OTQ3ZmZhMWM3MTBiNDI6NDMxMTRhNjBlOTM3NGQwZjllN2RmYWJhMjJiYTExZTk="
		},
		json: true
	}
	fetch('https://accounts.spotify.com/api/token', options).then(response=>{console.log(response)});
});


const PORT = process.env.PORT || 3000;
app.listen(PORT);

