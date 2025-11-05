declare module "*.module.css";

declare module "*.svg" {
	// biome-ignore lint/suspicious/noExplicitAny: no explicit any
	const content: any;
	export default content;
}

declare module "*.png" {
	// biome-ignore lint/suspicious/noExplicitAny: no explicit any
	const content: any;
	export default content;
}
