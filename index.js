var express = require('express');
const http = require('http');
var app = express();

var host = 'api.worldweatheronline.com';
var apiKey = 'efb62f8cf2d54a8685e173920172207';

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

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
  // var city = request.body.result.parameters['geo-city'];
  var date = '';
  response.json(JSON.stringify({ 'city': 'city' }));
  // if (request.body.result.parameters['date']) {
  //   date = request.body.result.parameters['date'];
  //   console.log('Date: ' + date);
  // };

  // // Call the weather API
  // callWeatherApi(city, date).then((output) => {
  //   // Return the results of the weather API to API.AI
  //   response.json(JSON.stringify({ 'speech': output, 'displayText': output }));
  // }).catch((error) => {
  //   // If there is an error let the user know
  //   response.json(JSON.stringify({ 'speech': error, 'displayText': error }));
  // });
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
