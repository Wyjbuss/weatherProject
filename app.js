const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();

const port = 3000;

// used/required in order to start using body parser in our code
// parses the html file
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', function(req, res) {
	res.sendFile(`${__dirname}/index.html`) // must add __dirname to get the path


});

app.post("/", function(req, res) {


	const query = req.body.cityName;
	const apiKey = '921ae217379371fec2fd61cd0ec56121'
	const unit = "imperial"
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;
	// gives us back a response
	https.get(url, function(response) {
		console.log("statusCode:", response.statusCode); // 404 error when user types invalid cityName
		if (response.statusCode == 404) {
			// added error respons handeling
			console.log(`Error: probably incorrect cityName`);
			return
		};
		console.log("date:", response.headers.date);

		response.on('data', function(data) {
			const weatherData = JSON.parse(data);
			const weatherIcon = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
			// the degrees symbole: hold ALT and type 0176 °
			res.write(`<h1>The temerature in ${weatherData.name} is ${weatherData.main.temp} F</h1>`);
			res.write(`<p>It is currently: ${weatherData.weather[0].description}</p>`);
			res.write(`<img src="${weatherIcon}" alt="">`)
			res.send();
		});

	});

});



// listening to the port to see if there is any requests
app.listen(port, function() {
	console.log(`Server running on port ${port}.`);
})
