import React, {Component} from 'react';

import companyName from './companyNames';
import thing from './things';
import {toCurrency} from './formatter';

const shouldTrigger = () => Math.random() < 0.8;
const triggers = () => Math.ceil(Math.random() * 3);
const change = (maxChange) => Math.ceil(Math.random() * 2 * maxChange) - maxChange;

const expectations = (maxChange, years) => {
	// return {
	// 	1: [12000],
	// 	2: [12000],
	// 	3: [12000],
	// 	4: [12000],
	// };
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
		flattened.push(0);
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

class SumOfTheYear extends Component {

	constructor() {
		super();
		const years = Math.floor(Math.random() * 7 + 2);
		const endValue = Math.floor(Math.random() * 999 + 1) * 1000;
		this.state = {
			showSolution : false,
			companyName : companyName(),
			interest : (Math.floor(Math.random() * 15) + 1) / 100,
			thing : thing(),
			endValue,
			years,
			expectations : expectations(endValue / 10, years)
		}
	}

	render() {
		const yearSpecification = Object.keys(this.state.expectations).map(e => {
			if (this.state.expectations[e].length === 0) {
				return <div />;
			}
			return <div><p>In jaar {e} gebeurt het volgende:</p>
				<ul>{this.state.expectations[e].map(val => <li>{changeToString(val)}</li>)}</ul>
			</div>
		});

		const flattened = flattenedChanges(this.state.years, this.state.expectations);
		const solution = this.state.showSolution ?
			<div>
				<p>{toCurrency(findSolution(this.state.endValue, this.state.interest, this.state.years, this.state.expectations))}</p>
				<p>Eerst berekenen we de resultaten per jaar:</p>
				<ul>
					{flattened.map((e, i) =>
						<li>Jaar {i}: {toCurrency(e)}</li>)}
				</ul>
				<p>Dan rekenen we de waardes per jaar uit:</p>
				<ul>
					{flattened.filter((e,i) => i !== 0).map((e, i) =>
						<li>Jaar {i}: {toCurrency(e)} delen door (1+{this.state.interest})^{i}
							= {Math.pow(1 + this.state.interest, i)}. Uiteindelijk wordt
							dat {toCurrency(e / Math.pow(1 + this.state.interest, i))}</li>)}
				</ul>
				<p>Tenslotte verkopen we voor {toCurrency(this.state.endValue)} na {this.state.years} jaar. Dat wordt
					dan {toCurrency(this.state.endValue)} / (1+{this.state.interest})^{this.state.years}
					= {toCurrency(this.state.endValue / Math.pow(1 + this.state.interest, this.state.years))}.</p>
				<p>Bij elkaar opgeteld geeft dat dan het bovenstaande antwoord.</p>
			</div> : null;

		return <div>
			<p>Bedrijf {this.state.companyName} hanteert een rentedisconteringsvoet
				van {this.state.interest * 100}%. Ze zijn eigenaar van een {this.state.thing}.
				Deze willen ze verkopen over {this.state.years} jaar voor {toCurrency(this.state.endValue)}.</p>

			<p>In deze {this.state.years} jaar/jaren zijn er nog de volgende verwachtingen.</p>
			{yearSpecification}

			<strong>Wat is de huidige bedrijfswaarde van {this.state.thing} voor {this.state.companyName}?</strong>

			<p style={{textDecoration : 'underline', cursor : 'pointer'}}
			   onClick={() => this.setState({showSolution : true})}>
				Toon oplossing
			</p>
			{solution}
		</div>
	}
}

export default SumOfTheYear;
