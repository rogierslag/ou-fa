import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import Null from './null.js';
import InterestDiscountRate from './interestDiscountRate.js';
import SumOfTheYearGenerator from './sumOfTheYear.js';

const formula = (name, instantiator) => ({name, instantiator});

const formulas = [
	formula('REV', Null),
	formula('RTV', Null),
	formula('Leverage', Null),
	formula('Marge tot bruto resultaat', Null),
	formula('Marge tot resultaat', Null),
	formula('Acid test', Null),
	formula('Quick ratio', Null),
	formula('Werkkapitaalratio', Null),
	formula('WPA', Null),
	formula('Koers-winstverhouding', Null),
	formula('Operationele risico', Null),
	formula('Rente dekkingsfactor', Null),
	formula('Toegevoegde waarde', Null),
	formula('TW per werknemer', Null),
	formula('Gemiddelde personeelskosten', Null),
	formula('Sum-of-the-year methode', SumOfTheYearGenerator),
	formula('Rentedisconteringsvoet', InterestDiscountRate),
];

const validFormulas = () => formulas.filter(e => e.instantiator !== Null);

const formulaStyle = {
	height : 35,
	cursor : 'pointer'
};
const questionNavigationStyle = {
	width : '33%',
	fontWeight : 'normal',
	float : 'left',
	fontSize : '16px',
	cursor : 'pointer',
	textDecoration : 'underline'
};

class App extends Component {

	constructor() {
		super();
		this._newExercise = this._newExercise.bind(this);
		this.state = {
			exercise : null,
			showPossibilities : true,
			instantiator : null
		}
	}

	_newExercise(instantiator) {
		const exercise = instantiator();
		this.setState({showPossibilities : false, exercise, instantiator : instantiator});
	}

	_randomExercise() {
		const valids = validFormulas();
		const instantiator = valids[Math.floor(Math.random() * valids.length)].instantiator;
		this.setState({showPossibilities : false, exercise: instantiator(), instantiator});
	}

	render() {
		const supportText = this.state.showPossibilities ? <h2>Kies een berekening om te oefenen</h2> :
			<h2>Probeer de volgende opgave</h2>;
		const other = this.state.showPossibilities ? null :
			<div style={{marginTop : '20px'}}>
				<h3 style={questionNavigationStyle} onClick={() => this._newExercise(this.state.instantiator)}>Nieuwe
					opgave</h3>
				<h3 style={questionNavigationStyle} onClick={() => this.setState({showPossibilities : true})}>Andere
					opgave</h3>
				<h3 style={questionNavigationStyle} onClick={() => this._randomExercise()}>Willekeurige opgave</h3>
			</div>;
		const selectFormulas = this.state.showPossibilities ? <ol>
			{validFormulas().map((e, i) => <li style={formulaStyle} key={i}
			                                 onClick={() => this._newExercise(e.instantiator)}>{e.name}</li>)}
		</ol> : null;
		const exerciseBlock = this.state.showPossibilities ? null : this.state.exercise;
		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo"/>
					{supportText}
				</div>
				{selectFormulas}
				{exerciseBlock}
				{other}
			</div>
		);
	}
}

export default App;
