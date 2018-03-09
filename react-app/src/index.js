import React from 'react';
import ReactDOM from 'react-dom';
import restaurants from './output.json'

var restaurant = restaurants[0];
console.log(restaurant);

class PromoLaFourchette extends React.Component {
	render() {
		return (
			<li>
				{this.props.offer.title}<br/>{this.props.offer.description}
			</li>)
	}
}
class PromoMichelin extends React.Component {
	render() {
		return (
			<li>
				{this.props.offer.description}<br/>{this.props.offer.availability}
			</li>)
	}
}
class Promos extends React.Component {
	render() {
		return (
			)
	}
}
class Address extends React.Component {
	render() {
		return (
			<div class="address">
				{this.props.address.street_block}<br/>
				{this.props.address.postal_code}<br/>
				{this.props.address.locality}
			</div>)
	}
}
class Restaurant extends React.Component {
	render() {
		return (
			<div class="container">
				<h1>{this.props.value.title}</h1>
				<Address address={this.props.value.address}/>
				<div class="container-fluid">
					<div class="description">
						{this.props.value.description}
					</div>
					<div>
						{this.props.value.price}
					</div>
				</div>
				<div class="offers">
					<div class="michelin_offers">
						<ul>
							{
								this.props.value.offers.map(function(offer){
									return <PromoMichelin offer={offer}/>
								})
							}
						</ul>
					</div>
					<div class="la-fourchette_offers">
						<ul>
							{
								this.props.value.promo_la_fourchette.map(function(offer){
									return <PromoLaFourchette offer={offer}/> 
								})
							}
						</ul>
					</div>
				</div>
				<div class="contact">
					{this.props.value.contact_details.phone}<br/>
					{this.props.value.contact_details.website}
				</div>
			</div>
		);
	}
}

ReactDOM.render(
  <Restaurant value={restaurant}/>,
  	document.getElementById('root')
);
