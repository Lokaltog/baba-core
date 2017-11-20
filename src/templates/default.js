/* eslint-disable no-unused-vars, no-undef */

function ClosureWrapper(fn, args=[]) {
	this.toString = () => fn(...args) + '';
}

function shuffle(arr) {
	let randomIndex, itemAtIndex, i;
	for (i = arr.length - 1; i > 0; i--) {
		randomIndex = Math.floor(Math.random() * (i + 1));
		itemAtIndex = arr[i];
		arr[i] = arr[randomIndex];
		arr[randomIndex] = itemAtIndex;
	}
}

// @choice
const randomNode = fn => {
	let cached = [];
	return new ClosureWrapper(() => {
		if (!cached.length) {
			// Flatten array (e.g. arrays of weighted items)
			cached = Array.prototype.concat.apply([], fn());
			shuffle(cached);
		}
		return cached.pop();
	});
};

let _vars = {};

// @variable
const variableRef = (id, ref) => {
	let currentVal = _vars[id] || (ref() + '');
	const ret = new ClosureWrapper(() => currentVal);
	ret.a = (value, optional) => new ClosureWrapper(() =>
		!currentVal || !optional ? (currentVal = value() + '') : currentVal);
	return ret;
};

// @concat
const concatNode = fn => new ClosureWrapper(() => fn().map(node => node + '').join(''));

// @mapping
const mapRules = (...rules) => input => new ClosureWrapper(() => {
	let ret;
	let str = input() + '';
	rules.some(filter => ret = str.match(filter[0]) && str.replace(filter[0], filter[1]));
	return ret || str;
});

// @function
const mapFunction = fn => input => new ClosureWrapper(() => fn(input + ''));

// @export
const exportValue = fn => {
	return vars => {
		_vars = vars || {};
		return fn() + '';
	};
};
