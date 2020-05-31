// Creating a http server using the http module
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
	let redirect = 'https://shrouded-escarpment-08729.herokuapp.com/login/redirect/access'
	let encoded = encodeURIComponent(`${my_client_id}:${my_client_secret}`);
	let options = {
		method: 'POST',
		body: JSON.stringify({
			grant_type: 'authorization_code',
			code: auth_code,
			redirect_uri: encodeURIComponent(redirect)
		}),
		headers: {
			Authorization: `Basic ${encoded}`
		}
	}
	fetch('https://accounts.spotify.com/api/token', options).then(response=>{console.log(response)});
});

app.get('/login/redirect/access', (req, res)=>{
	res.send(req.query);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT);

