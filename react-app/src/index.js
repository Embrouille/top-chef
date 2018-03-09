import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import restaurants from './output.json';
import star from './star.png'

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
			<p class="adress">
				{this.props.address.street_block},&nbsp;
				{this.props.address.postal_code}&nbsp;
				{this.props.address.locality}
			</p>)
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
class NameFilterButton extends React.Component {
	render() {
		return (
			'namefilterbutton');
	}
}
class SortByStarsButton extends React.Component {
	render() {
		return (
			'sortByStarsButton');
	}
}
class Restaurants extends React.Component {
	render() {
		return (
			<html>
				<header>
					<h1>Restaurants Michelin</h1>
				</header>
				<body>
					<div>
						<div class='container sort-filtering-menu'>
							<NameFilterButton/>
							<SortByStarsButton/>
						</div>
						<div class='container restaurants'>
							<ul>
								{
									this.props.value.map(function(restaurant){
										return <Restaurant value={restaurant}/>
									})
								}
							</ul>
						</div>
					</div>
				</body>
			</html>)
	}
}
ReactDOM.render(
  <Restaurants value={restaurants}/>,
  	document.getElementById('root')
);