import React, {Component} from 'react';
import PropTypes from 'prop-types';

import companyName from './companyNames';
import {toCurrency, asRounded} from './formatter';

class InterestCoverageRatio extends Component {

	constructor() {
		super();
		this.state = {showSolution : false};
	}

	componentWillReceiveProps() {
		this.setState({showSolution : false});
	}

	_total() {
		return this.props.profit + this.props.interest + this.props.taxes;
	}

	_solution() {
		const ratio = this._total() / this.props.interest;
		const healthNote = ratio < 3 ? 'Dit is een ongezonde ratio (lager dan 3)' : 'Dit is een gezonde ratio (3 of hoger)';
		const solution = <p>
			De rentedekkingsfactor voor {this.props.companyName} is {asRounded(this._total() / this.props.interest)}.
			&nbsp;
			{healthNote}
		</p>;
		const result = this.props.splitted ?
			<p>Eerst berekenen we het bedrijfsresultaat. Dit is {toCurrency(this.props.profit)} +&nbsp;
				{toCurrency(this.props.interest)} + {toCurrency(this.props.taxes)} =&nbsp;
				{toCurrency(this._total())}.
			</p> : null;
		const solutionExplanation = <p>We berekenen nu de rentedekkingsgraad door het bedrijfsresultaat te delen door
			de rentelaten. Oftewel {toCurrency(this.props.profit + this.props.interest + this.props.taxes)} /&nbsp;
			{toCurrency(this.props.interest)} = {asRounded(this._total() / this.props.interest)}.</p>;
		return <div>
			{solution}
			{result}
			{solutionExplanation}
		</div>;
	}

	_question() {
		const question = <strong>
			Wat is de rentedekkingsgraad van {this.props.companyName} voor dat jaar? Is dit een gezonde ratio?
		</strong>;
		const showSolution = <p style={{textDecoration : 'underline', cursor : 'pointer'}}
		                        onClick={() => this.setState({showSolution : !this.state.showSolution})}>
			Toon oplossing
		</p>;
		if (this.props.splitted) {
			return <div>
				<p>
					Bedrijf {this.props.companyName} heeft in een jaar een winst geboekt van&nbsp;
					{toCurrency(this.props.profit)}. Hierover moeten vervolgens nog de rentelasten van&nbsp;
					{toCurrency(this.props.interest)} betaald woden, en belastingen ter waarde van&nbsp;
					{toCurrency(this.props.taxes)}.
					<br/>
					{question}
				</p>
				{showSolution}
			</div>
		}
		return <div>
			<p>
				Bedrijf {this.props.companyName} heeft in een jaar een EBITDA van {toCurrency(this._total())}
				&nbsp; behaald. De rentelasten over datzelfde jaar waren {toCurrency(this.props.interest)}.
				<br/>
				{question}
			</p>
			{showSolution}
		</div>;
	}

	render() {
		const solution = this.state.showSolution ? this._solution() : null;

		return <div>
			{this._question()}
			{solution}
		</div>
	}
}

InterestCoverageRatio.propTypes =
	{
		profit : PropTypes.number.isRequired,
		interest : PropTypes.number.isRequired,
		taxes : PropTypes.number.isRequired,
		companyName : PropTypes.string.isRequired,
		splitted : PropTypes.bool.isRequired,
	};

const someNumber = (max, offset) => {
	return (Math.floor(Math.random() * max + 1) + offset ) * 1000;
};

const generator = () => {
	const profit = someNumber(400, 300);
	const interest = someNumber(90, 250);
	const taxes = someNumber(100, 100);
	const splitted = Math.random() < 2 / 3;

	return <InterestCoverageRatio profit={profit} interest={interest} taxes={taxes} companyName={companyName()}
	                              splitted={splitted}/>;
};

export default generator;
