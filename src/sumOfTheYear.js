import React, {Component} from 'react';
import PropTypes from 'prop-types';

import companyName from './companyNames';
import thing from './things';
import {toCurrency} from './formatter';

class SumOfTheYear extends Component {

	constructor() {
		super();
		this.state = {};
		this._freshState();
	}

	componentWillReceiveProps() {
		this._freshState();
	}

	_freshState() {
		this.setState({showSolution : false});
	}

	_denominator() {
		let denominator = 0;
		for (let i = 1; i <= this.props.years; i++) {
			denominator += i;
		}
		return denominator;
	}

	_denominatorYears() {
		const denominators = [];
		for (let i = this.props.years, j = 1; i >= 1; i--, j++) {
			denominators[j] = i
		}
		return denominators;
	}

	_solutionTable() {
		let previousValue = this.props.startValue - this.props.endValue;
		const denominator = this._denominator();
		const otherRows = this._denominatorYears().map((e, i) => {
			const deductible = (this.props.startValue - this.props.endValue) * e / denominator;
			previousValue -= deductible;
			return <tr key={i}>
				<td>{i}</td>
				<td>{toCurrency(deductible)}</td>
				<td>{toCurrency(previousValue + this.props.endValue)}</td>
				<td>{e} / {denominator}</td>
			</tr>;
		});
		return <table>
			<thead>
			<tr>
				<th width={80}>Jaar</th>
				<th width={180}>Afschrijving</th>
				<th width={180}>Boekwaarde</th>
				<th width={180}>Afschrijvingsdeel</th>
			</tr>
			</thead>
			<tbody>
			<tr>
				<td>0</td>
				<td><i>nvt</i></td>
				<td>{toCurrency(this.props.startValue)}</td>
				<td><i>nvt</i></td>
			</tr>
			{otherRows}
			</tbody>
		</table>;
	}

	render() {

		const solution = this.state.showSolution ?
			<div>
				Het bedrag wat we moeten afschrijven is {toCurrency(this.props.startValue)}&nbsp;
				- {toCurrency(this.props.endValue)} = {toCurrency(this.props.startValue - this.props.endValue)}.
				In het eerste jaar schrijven we {this.props.years}/{this._denominator()} van dit bedrag af.
				<br/><br/>
				In het eerste jaar is de afschrijvingswaarde dus {this.props.years}/{this._denominator()} *&nbsp;
				{toCurrency(this.props.startValue - this.props.endValue)} =&nbsp;
				{toCurrency((this.props.startValue - this.props.endValue) * this.props.years / this._denominator())}.
				<br /><br/>
				De boekwaarde na het eerste jaar is dan {toCurrency(this.props.startValue)} -&nbsp;
				{toCurrency((this.props.startValue - this.props.endValue) * this.props.years / this._denominator())}
				=&nbsp;
				{toCurrency(this.props.startValue - ((this.props.startValue - this.props.endValue) * this.props.years / this._denominator()))}.
				<br />
				<br />
				Als we dit verder uitwerken, komen we op de volgende tabel uit.
				{this._solutionTable()}
			</div> : null;

		return <div>
			<p>Bedrijf {this.props.companyName} is eigenaar van een {this.props.thing} ter waarde
				van {toCurrency(this.props.startValue)}.
				Deze wordt afgeschreven over {this.props.years} jaar met de sum-of-the-years methode.
				Na {this.props.years} jaar is de waarde nog {toCurrency(this.props.endValue)}</p>

			<strong>Bereken de boekwaarde en afschrijving voor ieder jaar</strong>

			<p style={{textDecoration : 'underline', cursor : 'pointer'}}
			   onClick={() => this.setState({showSolution : !this.state.showSolution})}>
				Toon oplossing
			</p>
			{solution}
		</div>
	}
}

SumOfTheYear.propTypes = {
	startValue : PropTypes.number.isRequired,
	endValue : PropTypes.number.isRequired,
	years : PropTypes.number.isRequired,
	companyName : PropTypes.string.isRequired,
	thing : PropTypes.string.isRequired
};

const generator = () => {
	const years = Math.floor(Math.random() * 4 + 2);
	const startValue = Math.floor(Math.random() * 999 + 1) * 1000;
	const endValue = Math.round(Math.random() * 0.6 * startValue, 0);
	return <SumOfTheYear companyName={companyName()} startValue={startValue} endValue={endValue} thing={thing()}
	                     years={years} showSolution={false}
	/>;
};

export default generator;
