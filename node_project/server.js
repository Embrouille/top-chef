var http = require('http');
var request = require('request');
var cheerio = require('cheerio');
var michelin = require('./michelin');


start_server();


function start_server()
{
	var server = http.createServer(function(req, res) {
		michelin.print_restaurants();
	});
	server.listen(8081);
}