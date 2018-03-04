var http = require('http');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var getImgSrc = require('get-img-src');

var server = http.createServer(function(req, res) {
	var json = {};
	var key = 'restaurants';
	json[key] = [];
	var urls = [];
	generate_url(json, key, urls);
});
function generate_url(json, key, urls)
{
	var promises_urls = [];
	tabUrls = [];
	for(let i=1; i<=35; i++)
	{
		promises_urls.push(scrap_url(i));
	}
	Promise.all(promises_urls).then(values=>{
		values.forEach(function(url){
			urls = urls.concat(url);
			//urls.push(url);
		})
		scrap_pages(json, key, urls);
	});
}
function scrap_url(i)
{
	return new Promise((resolve, reject) => {
		var urls=[];
		request(('https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-'+i), function (error, response, html) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(html);
				$('.poi-card-link').each(function(){
					urls.push('https://restaurant.michelin.fr'+$(this).attr('href'));
				})
				resolve(urls);
			}
		});
	});
}
function scrap_pages(json, key, urls)
{
	var promises_pages = [];
	urls.forEach(function(url){
		promises_pages.push(scrap_page(url));
	})
	Promise.all(promises_pages).then(values=>{
		values.forEach(function(restaurant){
			json[key].push(restaurant);
		})
		fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
	    	console.log('File successfully written! - Check your project directory for the output.json file');
		});
	});
}
server.listen(8081);

function scrap_page(url)
{
	return new Promise((resolve, reject) => {
		request(url, function (error, response, html) {
		  	if (!error && response.statusCode == 200) {
			  	const $ = cheerio.load(html);
		  		const restaurant = {'title' : '', 'chef' : '', 'description' : '', 'specialities' : '', 'adress':{'street_block' : '', 'postal_code' : '', 'locality' : ''}, 'price' : '', 'picture' : '', 'stars' : '', 'contact_details' : {'phone' : '', 'website' : ''}};
		  		restaurant.title = $('.poi_intro-display-title').text().trim();
		  		restaurant.chef = $('.node_poi-chef').children('.node_poi_description').children().first().children('.field__items').children().first().text().trim();
		  		restaurant.description = $('.poi_intro-display-cuisines').text().trim();
		  		restaurant.specialities = $('.field--name-field-specials').children('.field__items').children().first().text().trim();
			  	restaurant.adress.street_block = $('.street-block').children().first().text().trim();
			  	restaurant.adress.postal_code = $('.postal-code').first().text();
			  	restaurant.adress.locality = $('.locality').first().text().trim();
			  	restaurant.price = $('.poi_intro-display-prices').text().trim();
			  	//restaurant.picture = getImgSrc($('.views-field-field-image').children().first().children().first().html())[1];
			  	var guideStars = $('.guide-icon');
			  	restaurant.stars = guideStars.hasClass('icon-cotation1etoile') ? 1 : (guideStars.hasClass('icon-cotation2etoiles') ? 2 : 3);
			  	restaurant.contact_details.phone = $('.tel').children().first().text();
			  	restaurant.contact_details.website = $('.website').children().first().children().first().children().first().children().first().text().trim();
			  	resolve(restaurant);
		  	}
		});
	});
}
