export const toOptions = <T>(array: T[]) =>
	array.map((key) => ({
		text: key,
		value: key,
	}));
