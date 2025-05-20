declare module "*.module.css";

declare module "*.svg" {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const content: any;
	export default content;
}

declare module "*.png" {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const content: any;
	export default content;
}
