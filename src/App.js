import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import Null from './null.js';
import SumOfTheYear from './sumOfTheYear.js';

const formula = (name, component) => ({name, component});

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
	formula('Sum-of-the-year methode', SumOfTheYear),
	formula('Rentedisconteringsvoet', Null),
];

const formulaStyle = {
	height: 35,
	cursor: 'pointer'
};

class App extends Component {

	constructor() {
		super();
		this._newExercise = this._newExercise.bind(this);
		this.state = {
			exercise : null,
			showPossibilities : true
		}
	}

	_newExercise(componentType) {
		console.log(`Should now instantiate a ${componentType}`);
		const exercise = React.createElement(componentType, {});
		this.setState({showPossibilities:false, exercise});
	}

	render() {
		const supportText = this.state.showPossibilities ? <h2>Kies een berekening om te oefenen</h2> :
			<h2>Probeer de volgende opgave</h2>;
		const selectFormulas = this.state.showPossibilities ? <ol>
			{formulas.filter(e => e.component !== Null)
				.map((e,i) => <li style={formulaStyle} key={i} onClick={() => this._newExercise(e.component)}>{e.name}</li>)}
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
			</div>
		);
	}
}

export default App;
