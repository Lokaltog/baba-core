/* eslint-disable no-unused-vars, no-undef */

function ClosureWrapper(fn, args=[]) {
	this.toString = () => fn(...args) + '';
}

// @function
const functionWrapper = fn => (...args) => new ClosureWrapper(fn, args);

// @choice
const randomNode = fn => {
	let cached;
	return new ClosureWrapper(() => {
		if (!cached) {
			// Flatten array (e.g. arrays of weighted items)
			cached = Array.prototype.concat.apply([], fn());
		}
		return cached[Math.floor(Math.random() * cached.length)];
	});
};

let _vars = {};

// @variable
const variableRef = (id, ref) => {
	const ret = new ClosureWrapper(() => _vars[id] || (_vars[id] = ref() + ''));
	ret.a = value => new ClosureWrapper(() => _vars[id] = value() + '');
	return ret;
};

// @concat
const concatNode = fn => new ClosureWrapper(() => fn().join(''));

// TODO: Move to external module
const baba$$mapping = (input, rules) => {
	// Regex mapping helper for transforms
	let ret;
	let str = input + '';
	rules.some(filter => ret = str.match(filter[0]) && str.replace(filter[0], filter[1]));
	return ret;
};

// @export
const exportValue = fn => {
	return vars => {
		_vars = vars || {};
		return fn() + '';
	};
};
