export const isRequired = value =>
	!value?.toString() || value?.toString()?.length === 0 ? true : false;

export const maxLength = (value, length) =>
	value && value?.length > length ? true : false;

export const lengthEquals = (value, length) =>
	value && value?.length !== length ? true : false;

export const isPositiveInteger = value => {
	return !Number.isInteger(+value) || +value < 1 ? true : false;
};

const decimalRegex = /^[0-9]\d{0,14}(\.\d{1,4})?%?$/;

export const isValidWeightorRate = value =>
	value &&
	(!decimalRegex.test(+value) ||
		Math.floor(+value)?.toString()?.length > 13 ||
		value?.length > 18 ||
		+value < 0)
		? true
		: false;
