// Creating a http server using the http module
const express = require('express');

const app = express();


app.use(express.json());

app.get('/', (req,res)=>{
    res.send(JSON.stringify({status:200,
                            msg: 'OK'}));
});

const my_client_id = '240cd0ccc20e40e087947ffa1c710b42';
const redirect_uri = 'localhost:3000/login/redirect'
app.get('/login', function(req, res) {
	res.redirect('https://accounts.spotify.com/authorize' +
	  '?response_type=code' +
	  '&client_id=' + my_client_id +
	  '&redirect_uri=' + encodeURIComponent(redirect_uri));
});

app.get('/login/redirect', (req, res) => {
	console.log(req);
	res.send(req);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
