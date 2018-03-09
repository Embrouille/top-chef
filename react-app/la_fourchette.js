var http = require('http');
var request = require('request');
var cheerio = require('cheerio');
var accents = require('remove-accents');

function set_deals(restaurants_json)
{
	return new Promise((resolve, reject) => {
		var promises_pages = [];
		restaurants_json.forEach(function(value){
			promises_pages.push(set_deal(value));
		});
		Promise.all(promises_pages).then(values=>{
			console.log(values);
			resolve(values);
		})
	});
}

function set_deal(restaurant)
{
	return new Promise((resolve, reject) => {
		get_restaurant_promo_url(restaurant).then(function(url){
			get_restaurant_deals(url).then(function(deals){
				if(deals[0])
				{
					deals.forEach(function(deal){
						console.log(deal);
						restaurant.promo_la_fourchette.push(deal);
					});
				}
				resolve(restaurant);
			});
		});
	});
}

function get_restaurant_promo_url(restaurant_json)
{
	var title = accents.remove(restaurant_json.title).toLowerCase().replace(/ /g,"-").replace(/'/g,"-");
	var url = "https://m.lafourchette.com/api/restaurant-prediction?name=" + title;
	return new Promise((resolve, reject) => {
		request(url, function (error, response, html) {
			if (!error && response.statusCode == 200) {
				var url_promo = "https://m.lafourchette.com/api/restaurant/";
				$ = cheerio.load(html);
				var content = JSON.parse($('body').text());
				for(let i=0; i<content.length; i++)
				{
					if(restaurant_json.address.postal_code == content[i].address.postal_code)
					{
						resolve(url_promo + content[i].id + "/sale-type");
					}
				}
				resolve("");
			}
			else
				resolve("");
		});
	});
}

function get_restaurant_deals(url)
{
	return new Promise((resolve, reject) => {
		request(url, function(error, response, html) {
			if (!error && response.statusCode == 200) {
				var deals = [];
				$ = cheerio.load(html);
				var content = JSON.parse($('body').text());
				if(!content.code)
				{
					content.forEach(function(offer){
						var deal = {'title' : '', 'description' : ''};
						if(offer.is_special_offer)
						{
							deal.title = offer.title;							
							deal.description = offer.description;
							deals.push(deal);
						}
					});
					resolve(deals);
				}
			}
			resolve({});
		});
	});
}

module.exports.set_deals = set_deals;