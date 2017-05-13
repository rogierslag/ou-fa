import React, {Component} from 'react';

import companyName from './companyNames';
import thing from './things';
import {toCurrency} from './formatter';

class SumOfTheYear extends Component {

	constructor() {
		super();
		const years = Math.floor(Math.random() * 4 + 2);
		const startValue = Math.floor(Math.random() * 999 + 1) * 1000;
		const endValue = Math.round(Math.random() * 0.6 * startValue, 0);
		this.state = {
			showSolution : false,
			companyName : companyName(),
			startValue,
			endValue,
			thing : thing(),
			years
		}
	}

	_denominator() {
		let denominator = 0;
		for (let i = 1; i <= this.state.years; i++) {
			denominator += i;
		}
		return denominator;
	}

	_denominatorYears() {
		const denominators = [];
		for (let i = this.state.years, j = 1; i >= 1; i--, j++) {
			denominators[j] = i
		}
		return denominators;
	}

	_solutionTable() {
		let previousValue = this.state.startValue - this.state.endValue;
		const denominator = this._denominator();
		const otherRows = this._denominatorYears().map((e, i) => {
			const deductible = (this.state.startValue - this.state.endValue) * e / denominator;
			previousValue -= deductible;
			return <tr key={i}>
				<td>{i}</td>
				<td>{toCurrency(deductible)}</td>
				<td>{toCurrency(previousValue + this.state.endValue)}</td>
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
				<td>{toCurrency(this.state.startValue)}</td>
				<td><i>nvt</i></td>
			</tr>
			{otherRows}
			</tbody>
		</table>;
	}

	render() {

		const solution = this.state.showSolution ?
			<div>
				Het bedrag wat we moeten afschrijven is {toCurrency(this.state.startValue)}&nbsp;
				- {toCurrency(this.state.endValue)} = {toCurrency(this.state.startValue - this.state.endValue)}.
				In het eerste jaar schrijven we {this.state.years}/{this._denominator()} van dit bedrag af.
				<br/><br/>
				In het eerste jaar is de afschrijvingswaarde dus {this.state.years}/{this._denominator()} *&nbsp;
				{toCurrency(this.state.startValue - this.state.endValue)} =&nbsp;
				{toCurrency((this.state.startValue - this.state.endValue) * this.state.years / this._denominator())}.
				<br /><br/>
				De boekwaarde na het eerste jaar is dan {toCurrency(this.state.startValue)} -&nbsp;
				{toCurrency((this.state.startValue - this.state.endValue) * this.state.years / this._denominator())}
				=&nbsp;
				{toCurrency(this.state.startValue - ((this.state.startValue - this.state.endValue) * this.state.years / this._denominator()))}.
				<br />
				<br />
				Als we dit verder uitwerken, komen we op de volgende tabel uit.
				{this._solutionTable()}
			</div> : null;

		return <div>
			<p>Bedrijf {this.state.companyName} is eigenaar van een {this.state.thing} ter waarde
				van {toCurrency(this.state.startValue)}.
				Deze wordt afgeschreven over {this.state.years} jaar met de sum-of-the-years methode.
				Na {this.state.years} jaar is de waarde nog {toCurrency(this.state.endValue)}</p>

			<strong>Bereken de boekwaarde en afschrijving voor ieder jaar</strong>

			<p style={{textDecoration : 'underline', cursor : 'pointer'}}
			   onClick={() => this.setState({showSolution : true})}>
				Toon oplossing
			</p>
			{solution}
		</div>
	}
}

export default SumOfTheYear;
