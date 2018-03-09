import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import restaurants from './output.json'
import star from './star.png'

function OffersMichelinTitle(props){
	const isOffer = props.offers[0];
	if(isOffer)
		return <h2>Offres michelin</h2>;
	return null;
}
function OffersLaFourchetteTitle(props){
	const isOffer = props.offers[0];
	if(isOffer)
		return <h2>Offres la fourchette</h2>;
	return null;
}
class PromoLaFourchette extends React.Component {
	render() {
		return (
			<div class='card'>
				<li class='offer'>
					{this.props.offer.title}<br/>{this.props.offer.description}
				</li>
			</div>)
	}
}
class PromoMichelin extends React.Component {
	render() {
		return (
			<li class='offer card'>
				{this.props.offer.description}<br/>{this.props.offer.availability}
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
				Guide Michelin 2018 &nbsp;
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
					<h1>{this.props.value.title}</h1>
					<div class='stars'>
						<Star number={this.props.value.stars}/>
					</div>
					<Address address={this.props.value.address}/>
					<div>
						<span class='description'>
							{this.props.value.description}&nbsp;
						</span>
						|&nbsp;
						<span class='price'>
							{this.props.value.price}
						</span>
					</div>
					<div class='specialties'>
					Spécialité :&nbsp;
						{this.props.value.specialties}
					</div>
					<div class='offers'>
						<PromosMichelin offers={this.props.value.offers}/>
						<PromosLaFourchette promos={this.props.value.promo_la_fourchette}/>
					</div>
					<div class='contact'>
						<h2>Contact :</h2>
						{this.props.value.contact_details.phone}<br/>
						{this.props.value.contact_details.website}
					</div>
				</div>
			</li>
		);
	}
}
class Restaurants extends React.Component {
	render() {
		return (
			<div>
				<div class='container sortMenu'>

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
			</div>)
	}
}
ReactDOM.render(
  <Restaurants value={restaurants}/>,
  	document.getElementById('root')
);