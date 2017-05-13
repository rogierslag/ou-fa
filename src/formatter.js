export let toCurrency = amount => {
	const rx = /(\d+)(\d{3})/;
	const isPositive = amount >= 0;
	const workAmount = isPositive ? amount : amount * -1;
	const value = "€ " + workAmount.toFixed(2).replace('.', ',').replace(/^\d+/, (w) => {
				while (rx.test(w))
					w = w.replace(rx, '$1.$2');
				return w
			}
		);
	if (!isPositive) {
		return `- ${value}`;
	}
	return value;
};

export let asRounded = (amount, decimals = 1) => {
	const multiplier = Math.pow(10, decimals);
	return Math.round(amount * multiplier) / multiplier;
};
