const companyNames = [
	"pand",
	"keuken",
	"bedrijfspand",
	"winkel",
	"machine",
	"divisie"];

const get = (excluding = undefined) => {
	const possibilities = companyNames.filter(e => e !== excluding);
	return possibilities[Math.floor(Math.random() * possibilities.length)];
};

export default get;
