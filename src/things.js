const things = [
	"pand",
	"keuken",
	"bedrijfspand",
	"winkel",
	"machine",
	"divisie"
];

const get = (excluding = undefined) => {
	const possibilities = things.filter(e => e !== excluding);
	return possibilities[Math.floor(Math.random() * possibilities.length)];
};

export default get;
