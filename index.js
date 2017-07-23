var express = require('express');
const http = require('http');
var app = express();
var bodyParser = require('body-parser');

var host = 'api.worldweatheronline.com';
var wwoApiKey = 'efb62f8cf2d54a8685e173920172207';

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render('pages/index');
});

app.post('/json', function (request, response) {
  response.json({ 'speech': 'sample response from webhook', 'displayText': 'display text sample from webhook' });
});

app.post('/tempoWebhook', function (request, response) {
  console.log({ request });
  var city = request.body.result.parameters['geo-city'];
  var date = '';

  if (request.body.result.parameters['date']) {
    date = request.body.result.parameters['date'];
    console.log('Date: ' + date);
  };

  // Call the weather API
  callWeatherApi(city, date).then((output) => {
    // Return the results of the weather API to API.AI
    response.json(JSON.stringify({ 'speech': output, 'displayText': output }));
  }).catch((error) => {
    console.log({ error });
    // If there is an error let the user know
    response.json(JSON.stringify({ 'speech': error, 'displayText': error }));
  });
});

function callWeatherApi(city, date) {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    let path = '/premium/v1/weather.ashx?format=json&num_of_days=1' +
      '&q=' + encodeURIComponent(city) + '&key=' + wwoApiKey + '&date=' + date;
    console.log('API Request: ' + host + path);
    // Make the HTTP request to get the weather
    http.get({ host: host, path: path }, (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // console.log({ body });
        // After all the data has been received parse the JSON for desired data
        let response = JSON.parse(body);
        let forecast = response['data']['weather'][0];
        let location = response['data']['request'][0];
        let conditions = response['data']['current_condition'][0];
        let currentConditions = conditions['weatherDesc'][0]['value'];
        // Create response
        let output = `Current conditions in the ${location['type']} 
        ${location['query']} are ${currentConditions} with a projected high of
        ${forecast['maxtempC']}°C or ${forecast['maxtempF']}°F and a low of 
        ${forecast['mintempC']}°C or ${forecast['mintempF']}°F on 
        ${forecast['date']}.`;
        // Resolve the promise with the output text
        // console.log({ output });
        resolve(output);
      });
      res.on('error', (error) => {
        reject({ error });
      });
    });
  });
}

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
