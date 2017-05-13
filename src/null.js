import React, {Component} from 'react';

class Null extends Component {
	render() {
		return <p>Empty</p>
	}
}

const generator = () => {
	return <Null />
};
export default generator;
