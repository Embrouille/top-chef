import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import restaurants from './output.json';
import './index.css';
import star from './Resources/star.png'
var accents = require('remove-accents');

function getRestaurantsByName(name){
	var result = [];
	var search_name = accents.remove(name).toLowerCase();
	restaurants.forEach(function(restaurant){
		var restaurant_name = accents.remove(restaurant.title).toLowerCase();
		if(restaurant_name.indexOf(search_name) >= 0)
			result.push(restaurant);
	});
	return result;
}

function getRestaurantsByStars(stars1, stars2, stars3){
	var stars = [];
	if(stars1) stars.push(1);
	if(stars2) stars.push(2);
	if(stars3) stars.push(3);
	var result = [];
	restaurants.forEach(function(restaurant){
		stars.forEach(function(star){
			if(star === restaurant.stars)
				result.push(restaurant);
		})
	})
	if(result[0])
		return result;
	return restaurants;
}
function OffersMichelinTitle(props){
	const isOffer = props.offers[0];
	if(isOffer)
		return <h3>Offres michelin</h3>;
	return null;
}
function OffersLaFourchetteTitle(props){
	const isOffer = props.offers[0];
	if(isOffer)
		return <h3>Offres la fourchette</h3>;
	return null;
}
class NameForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {value: ''};

		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleNameSubmit = this.handleNameSubmit.bind(this);
	}

	handleNameChange(event) {
		this.setState({value: event.target.value});
	}

	handleNameSubmit(event) {
		const new_restaurants = getRestaurantsByName(this.state.value);
		ReactDOM.render(
			  <Home value={new_restaurants}/>,
			  	document.getElementById('root')
			);
		event.preventDefault();
	}
	render() {
		return (
			<div class="name-form">
				<form onSubmit={this.handleNameSubmit}>
					<div class="container row">
						<div class="col-md">
							<label>Nom du restaurant :</label>
						</div>
						<div class="col">
							<input  type="text" value={this.state.value} onChange={this.handleNameChange} />
						</div>
						<div class="col-md">
							<input class="btn btn-primary" type="submit" value="Rechercher" />
						</div>
					</div>
				</form>
			</div>)
	}
}
class StarsForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {chkbox: [true, true, true]};

		this.handleStarsChange1 = this.handleStarsChange1.bind(this);
		this.handleStarsChange2 = this.handleStarsChange2.bind(this);
		this.handleStarsChange3 = this.handleStarsChange3.bind(this);
		this.handleStarsSubmit = this.handleStarsSubmit.bind(this);
	}

	handleStarsChange1(event) {
		this.state.chkbox[0] = !this.state.chkbox[0];
	}
	handleStarsChange2(event) {
		this.state.chkbox[1] = !this.state.chkbox[0];
	}
	handleStarsChange3(event) {
		this.state.chkbox[2] = !this.state.chkbox[0];
	}

	handleStarsSubmit(event) {
		const new_restaurants = getRestaurantsByStars(this.state.chkbox[0], this.state.chkbox[1], this.state.chkbox[2]);
		ReactDOM.render(
			  <Home value={new_restaurants}/>,
			  	document.getElementById('root')
			);
		event.preventDefault();
	}
	render() {
		return (
			<div class="stars-form">
				<form onSubmit={this.handleStarsSubmit}>
					<div class="container row">
							<div class="col-sm">
								<input type="checkbox" class="form-check-input" defaultChecked={this.state.chkbox[0]} onChange={this.handleStarsChange1}/>
								<label class="form-check-label">1 étoile</label>
							</div>
							<div class="col-sm">
							    <input type="checkbox" class="form-check-input" defaultChecked={this.state.chkbox[1]} onChange={this.handleStarsChange2}/>
							    <label class="form-check-label">2 étoiles</label>
							</div>
							<div class="col-sm">
							    <input type="checkbox" class="form-check-input" defaultChecked={this.state.chkbox[2]} onChange={this.handleStarsChange3}/>
							    <label class="form-check-label">3 étoiles</label>
							</div>
							<input class="btn btn-primary" type="submit" value="Rechercher" />
						</div>
				</form>
			</div>)
	}
}
class PromoLaFourchette extends React.Component {
	render() {
		return (
			<li class='offer card'>
				<p>{this.props.offer.title}</p>
				<p class="font-italic">{this.props.offer.description}</p>
			</li>)
	}
}
class PromoMichelin extends React.Component {
	render() {
		return (
			<li class='offer card'>
				<p>{this.props.offer.description}</p>
				<p class="font-italic">{this.props.offer.availability}</p>
			</li>)
	}
}
class PromosMichelin extends React.Component {
	render() {
		return (
			<div class='offers-div'>
				<OffersMichelinTitle offers={this.props.offers}/>
				<div class='offers'>
					<ul>
						{
							this.props.offers.map(function(offer){
								return <PromoMichelin offer={offer}/>
							})
						}
					</ul>
				</div>
			</div>)
	}
}
class PromosLaFourchette extends React.Component {
	render() {
		return (
			<div class='offers_div'>
				<OffersLaFourchetteTitle offers={this.props.promos}/>
				<div class='offers'>
					<ul>
						{
							this.props.promos.map(function(offer){
								return <PromoLaFourchette offer={offer}/>
							})
						}
					</ul>
				</div>
			</div>)
	}
}
class Address extends React.Component {
	render() {
		return (
			<div class="adress">
				{this.props.address.street_block},&nbsp;
				{this.props.address.postal_code}&nbsp;
				{this.props.address.locality}
			</div>)
	}
}
class Star extends React.Component {
	render() {
		var stars = []; var i=0;
		while(++i<=this.props.number){stars.push(i);} 
		return (
			<div>
				Guide Michelin 2018 :&nbsp;
				{stars.map(function (i) {
					return <img src={star} alt='star' width='20' height='20' />;
				})}
			</div>)
	}
}
class Restaurant extends React.Component {
	render() {
		return (
			<li class='restaurant'>
				<div class='container'>
					<h2>{this.props.value.title}</h2>
					<div class="row">
						<div class="col">
							<Address address={this.props.value.address}/>
							<span class='description'>
								{this.props.value.description}&nbsp;
							</span>
							|&nbsp;
							<span class='price'>
								{this.props.value.price}
							</span>
						</div>
						<div class='stars col'>
							<Star number={this.props.value.stars}/>
						</div>
					</div>
					<div class='specialties'>
					Spécialité :&nbsp;
						{this.props.value.specialties}
					</div>
					<div class='offers'>
						<PromosMichelin offers={this.props.value.offers}/>
						<PromosLaFourchette promos={this.props.value.promo_la_fourchette}/>
					</div>
					<div class='contact card'>
						<h3>Contact :</h3>
						<p>Téléphone :&nbsp;{this.props.value.contact_details.phone}</p>
						<p>Website :&nbsp;{this.props.value.contact_details.website}</p>
					</div>
				</div>
			</li>
		);
	}
}
class Restaurants extends React.Component {
	render() {
		return (
			<div class='container restaurants'>
				<ul>
					{
						this.props.value.map(function(restaurant){
							return <Restaurant value={restaurant}/>
						})
					}
				</ul>
			</div>
		);
	}
}

class Home extends React.Component {
	render() { 	
		return(
			<html>
				<header>
					<h1 class="text-center">Restaurants étoilés Guide Michelin</h1>
				</header>
				<body>
					<div>
						<div class="degrade"></div>
						<div class='container filtering-menu'>
							<NameForm/>
							<StarsForm/>
						</div>
						<Restaurants value={this.props.value}/>
					</div>
				</body>
			</html>)
	}
}

ReactDOM.render(
  <Home value={restaurants}/>,
  	document.getElementById('root')
);