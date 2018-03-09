var http = require('http');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var getImgSrc = require('get-img-src');
var la_fourchette = require('./la_fourchette');


function print_restaurants()
{
	get_restaurants().then(function(values){

		fs.writeFile('output.json', JSON.stringify(values, null, 4), function(err){
		    console.log('File successfully written! - Check your project directory for the output.json file');
		});
	});
}
function print_restaurantsbis()
{
	get_restaurants_file().then(function(values){
		fs.writeFile('output.json', JSON.stringify(values, null, 4), function(err){
		    console.log('File successfully written! - Check your project directory for the output.json file');
		});
	});
}
async function get_restaurants()
{
	console.log("Generating urls...");
	var urls = await generate_url();
	console.log("Generating restaurants...");
	var restaurants = await scrap_pages(urls);
	console.log("Generating promos...");
	var restaurantsbis = await la_fourchette.set_deals(restaurants);
	return restaurantsbis;
}
async function get_restaurants_file()
{
	return new Promise((resolve, reject) => {
		var restaurants = JSON.parse(fs.readFileSync('output.json'));
		restaurants.forEach(function(restaurant, index){
			la_fourchette.set_deal(restaurants[index]).then(function(restaurant){
				restaurants[index] = restaurant;
			});
		});
		resolve(restaurants);
	});
}
function generate_url()
{
	return new Promise((resolve, reject) => {
		var promises_urls = [];
		var urls = [];
		for(let i=1; i<=4; i++)
		{
			promises_urls.push(scrap_url(i));
		}
		Promise.all(promises_urls).then(values=>{
			values.forEach(function(url){
				urls = urls.concat(url);
			})
			resolve(urls);
		})
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
				});
				resolve(urls);
			}
		});
	});
}
function scrap_pages(urls)
{
	return new Promise((resolve, reject) => {
		var restaurants = [];
		var promises_pages = [];
		urls.forEach(function(url, i){
			promises_pages.push(scrap_page(url));
		})
		Promise.all(promises_pages).then(values=>{
			values.forEach(function(restaurant){
				restaurants.push(restaurant);
			})
			resolve(restaurants);
		});
	});
}

async function scrap_page(url)
{
	return new Promise((resolve, reject) => {
		request(url, function (error, response, html) {
		  	if (!error && response.statusCode == 200) {
			  	const $ = cheerio.load(html);
		  		const restaurant = {'title' : '', 'chef' : '', 'description' : '', 'specialities' : '', 'address':{'street_block' : '', 'postal_code' : '', 'locality' : ''}, 'price' : '', 'stars' : '', 'contact_details' : {'phone' : '', 'website' : ''}, 'offers' : [], 'promo_la_fourchette' : []};
		  		restaurant.title = $('.poi_intro-display-title').text().trim();
		  		restaurant.chef = $('.node_poi-chef').children('.node_poi_description').children().first().children('.field__items').children().first().text().trim();
		  		restaurant.description = $('.poi_intro-display-cuisines').text().trim();
		  		restaurant.specialities = $('.field--name-field-specials').children('.field__items').children().first().text().trim();
			  	restaurant.address.street_block = $('.street-block').children().first().text().trim();
			  	restaurant.address.postal_code = $('.postal-code').first().text();
			  	restaurant.address.locality = $('.locality').first().text().trim();
			  	restaurant.price = $('.poi_intro-display-prices').text().trim();
			  	var guideStars = $('.guide-icon');
			  	restaurant.stars = guideStars.hasClass('icon-cotation1etoile') ? 1 : (guideStars.hasClass('icon-cotation2etoiles') ? 2 : 3);
			  	restaurant.contact_details.phone = $('.tel').children().first().text();
			  	restaurant.contact_details.website = $('.website').children().first().children().first().children().first().children().first().text().trim();
			  	if($('.view-restaurant-offers')[0])
			  	{
			  		$('.view-restaurant-offers').children('.view-content').children().each(function(){
			  			var tempOffer = {'description' : '', 'availability' : ''};
			  			tempOffer.description = $(this).find('.title-wrapper').children('h2').text().trim();
			  			tempOffer.availability = $(this).find('.validity-dates-wrapper').text().trim();
			  			restaurant.offers.push(tempOffer);
			  		});
			  	}
			  	resolve(restaurant);
		  	}
		});
	});
}
module.exports.get_restaurants = get_restaurants;
module.exports.print_restaurants = print_restaurants;
module.exports.print_restaurantsbis = print_restaurantsbis;