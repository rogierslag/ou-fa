import React, {Component} from 'react';
import PropTypes from 'prop-types';

import companyName from './companyNames';
import thing from './things';
import {toCurrency} from './formatter';

const shouldTrigger = () => Math.random() < 0.8;
const triggers = () => Math.ceil(Math.random() * 3);
const change = (maxChange) => Math.ceil(Math.random() * 2 * maxChange) - maxChange;

const expectations = (maxChange, years) => {
	const res = {};
	for (let i = 1; i <= years; i++) {
		const year = [];
		if (shouldTrigger()) {
			const happenings = triggers();
			for (let j = 0; j < happenings; j++) {
				year.push(change(maxChange));
			}
		}
		res[i] = year;
	}
	return res;
};

const changeToString = (val) => {
	if (val === 0) {
		return '';
	}
	if (val > 0) {
		return `Er wordt ${toCurrency(val)} verdiend.`;
	}
	if (val < 0) {
		return `Er wordt ${toCurrency(val * -1)} verloren.`;
	}
};

const flattenedChanges = (years, changes) => {
	const flattened = [];
	for (let i = 1; i <= years; i++) {
		flattened[i] = 0;
	}
	Object.keys(changes).forEach(e => {
		flattened[e] = changes[e].reduce((a, b) => a + b, 0);
	});
	return flattened;
};

const findSolution = (endValue, interest, years, changes) => {
	const flattened = flattenedChanges(years, changes);

	return flattened.map((e, i) => e / Math.pow(1 + interest, i)).reduce((a, b) => a + b, 0) +
		endValue / Math.pow(1 + interest, years);
};

const noKeyedList = {
	listStyle : 'none'
};

class InterestDiscountRate extends Component {

	constructor() {
		super();
		this.state = {showSolution : false};
	}

	componentWillReceiveProps() {
		this.setState({showSolution : false});
	}

	render() {
		const yearSpecification = Object.keys(this.props.expectation).map((e, i) => {
			if (this.props.expectation[e].length === 0) {
				return <div key={i}/>;
			}
			return <div key={i}>
				<p>In jaar {e} gebeurt het volgende:</p>
				<ul style={noKeyedList}>
					{this.props.expectation[e].map((val, i) => <li key={i}>{changeToString(val)}</li>)}
				</ul>
			</div>
		});

		const flattened = flattenedChanges(this.props.years, this.props.expectation);
		const solution = this.state.showSolution ?
			<div>
				<p>{toCurrency(findSolution(this.props.endValue, this.props.interest, this.props.years, this.props.expectation))}</p>
				<p>Eerst berekenen we de resultaten per jaar:</p>
				<ul style={noKeyedList}>
					{flattened.map((e, i) =>
						<li key={i}>Jaar {i}: {toCurrency(e)}</li>)}
				</ul>
				<p>Dan rekenen we de waardes per jaar uit:</p>
				<ul style={noKeyedList}>
					{flattened.map((e, i) =>
						<li key={i}>Jaar {i}: {toCurrency(e)} delen door (1+{this.props.interest})^{i}
							= {Math.pow(1 + this.props.interest, i)}. Uiteindelijk wordt
							dat {toCurrency(e / Math.pow(1 + this.props.interest, i))}</li>)}
				</ul>
				<p>Tenslotte verkopen we voor {toCurrency(this.props.endValue)} na {this.props.years} jaar. Dat wordt
					dan {toCurrency(this.props.endValue)} / (1+{this.props.interest})^{this.props.years}
					= {toCurrency(this.props.endValue / Math.pow(1 + this.props.interest, this.props.years))}.</p>
				<p>Bij elkaar opgeteld geeft dat dan het bovenstaande antwoord.</p>
			</div> : null;

		return <div>
			<p>Bedrijf {this.props.companyName} hanteert een rentedisconteringsvoet
				van {this.props.interest * 100}%. Ze zijn eigenaar van een {this.props.thing}.
				Deze willen ze verkopen over {this.props.years} jaar voor {toCurrency(this.props.endValue)}.</p>

			<p>In deze {this.props.years} jaar/jaren zijn er nog de volgende verwachtingen.</p>
			{yearSpecification}

			<strong>Wat is de huidige bedrijfswaarde van {this.props.thing} voor {this.props.companyName}?</strong>

			<p style={{textDecoration : 'underline', cursor : 'pointer'}}
			   onClick={() => this.setState({showSolution : !this.state.showSolution})}>
				Toon oplossing
			</p>
			{solution}
		</div>
	}
}

InterestDiscountRate.propTypes =
	{
		interest : PropTypes.number.isRequired,
		endValue : PropTypes.number.isRequired,
		years : PropTypes.number.isRequired,
		companyName : PropTypes.string.isRequired,
		thing : PropTypes.string.isRequired,
		expectation : PropTypes.object.isRequired,
	};

const generator = () => {
	const years = Math.floor(Math.random() * 7 + 2);
	const endValue = Math.floor(Math.random() * 999 + 1) * 1000;
	const interest = (Math.floor(Math.random() * 15) + 1) / 100;
	const expectation = expectations(endValue / 10, years);

	return <InterestDiscountRate years={years} endValue={endValue} companyName={companyName()} interest={interest}
	                             thing={thing()} expectation={expectation}/>;
};

export default generator;
