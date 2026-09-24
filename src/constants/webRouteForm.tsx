import type { ReactNode } from "react";
import type { ControllerRenderProps, FieldError } from "react-hook-form";
import type { z } from "zod";
import { Admonition } from "@/components/Admonition";
import type { WebRoute } from "@/entities/WebRoute";
import type { paths } from "@/schemas/balancer-api";
import type { WebRouteFormSchema } from "@/schemas/WebRouteFormSchema";
import { toOptions } from "@/utilities/toOptions";
import { methods, schemes } from "./options";

const TARGET_PORT = 80;

type HealthCheck = {
	path: string;
	port: string;
	hostname: string;
	interval: string;
	timeout: string;
	follow_redirects: boolean;
	method: string;
	scheme: string;
	headers: {
		name: string;
		value: string;
	}[];
};

type Service = {
	id: string;
	weight: string;
};

type FormData = {
	name: string;
	hostname: string;
	path: string;
	target_port: string;
	healthcheck_enabled: boolean;
	isSecure: boolean;
	tls_termination?: string;
	insecure?: string;
	ip_version?: string;
	certificate_id?: string | string;
	cloud_gateway_id?: string;
	destination_proto?: string;
	source_proto?: string;
	healthcheck: HealthCheck;
	services: Service[];
};

export const ipOptions = [
	{
		text: "IPv4",
		value: "4",
	},
	{
		text: "IPv6",
		value: "6",
	},
];

const followRedirectsOptions = [
	{
		text: "trueCheck",
		value: true,
	},
	{
		text: "falseCheck",
		value: false,
	},
];

export const methodsOptions = toOptions<(typeof methods)[number]>(methods);
export const optionsOfScheme = toOptions<(typeof methods)[number]>(schemes);

export enum TlsTermination {
	EDGE = "edge",
	RE_ENCRYPT = "re-encrypt",
	PASSTHROUGH = "passthrough",
}

export const tlsOptions = [
	{ text: "Edge", value: TlsTermination.EDGE },
	{ text: "Re-encrypt", value: TlsTermination.RE_ENCRYPT },
	{ text: "Passthrough", value: TlsTermination.PASSTHROUGH },
];

export const certificateDefaultOptions = [
	{ text: "Let's Encrypt", value: "none" },
];

export const useCertificatePassthroughOptions = () => {
	return [{ text: "Provided by target server", value: "none" }];
};

export const insecureOptions = [
	{ text: "allow", value: "allow" },
	{ text: "redirect", value: "redirect" },
];

export const initialState: FormData = {
	name: "",
	hostname: "",
	path: "",
	target_port: "",
	healthcheck_enabled: false,
	isSecure: false,
	tls_termination: "",
	insecure: "",
	ip_version: ipOptions[0].value,
	certificate_id: "",
	cloud_gateway_id: "",
	source_proto: "tcp",
	destination_proto: "tcp",
	healthcheck: {
		path: "/",
		port: "",
		hostname: "",
		interval: "30",
		timeout: "5",
		follow_redirects: true,
		method: methodsOptions[0].value,
		scheme: "",
		headers: [
			{
				name: "",
				value: "",
			},
		],
	},
	services: [
		{
			id: "",
			weight: "",
		},
	],
};

export type RouteInfo = WebRoute;

export const toInitialValues = (data: RouteInfo): FormData => {
	const headersInfo = data.healthcheck?.headers
		? Object.entries(data.healthcheck.headers)
		: [];
	const headers = headersInfo.length
		? headersInfo.map((header) => ({
				name: header[0],
				value: header[1],
			}))
		: initialState.healthcheck.headers;

	return {
		name: data.name ?? "",
		hostname: data.hostname ?? "",
		path: data.path ?? "",
		target_port: data.target_port ? `${data.target_port}` : "",
		healthcheck_enabled: data.healthcheck_enabled ?? false,
		isSecure: !!data.tls_termination,
		tls_termination: data.tls_termination ?? "",
		insecure: data.insecure ?? "",
		ip_version: data.ip_version ? `${data.ip_version}` : ipOptions[0].value,
		certificate_id: data.certificate_id ? `${data.certificate_id}` : "",
		cloud_gateway_id: data.cloud_gateway_id ? `${data.cloud_gateway_id}` : "",
		destination_proto: data.destination_proto ?? "",
		source_proto: data.source_proto ?? "",
		healthcheck: data.healthcheck
			? {
					path: data.healthcheck.path ?? "",
					scheme: data.healthcheck.scheme ?? "",
					hostname: data.healthcheck.hostname ?? "",
					port: data.healthcheck.port ? `${data.healthcheck.port}` : "",
					interval: data.healthcheck.interval
						? `${data.healthcheck.interval}`
						: "",
					timeout: data.healthcheck.timeout
						? `${data.healthcheck.timeout}`
						: "",
					headers,
					method: data.healthcheck.method ?? "",
					follow_redirects: data.healthcheck.follow_redirects ?? true,
				}
			: initialState.healthcheck,
		services: data.routes_services?.length
			? data.routes_services.map((serviceInfo) => ({
					id: `${serviceInfo.service_id}`,
					weight: serviceInfo.value ? `${serviceInfo.value}` : "",
				}))
			: [
					{
						id: "",
						weight: "",
					},
				],
	};
};

export const toRequestBody = (values: z.infer<typeof WebRouteFormSchema>) => {
	const {
		certificate_id,
		healthcheck,
		cloud_gateway_id,
		tls_termination,
		services,
		insecure,
		target_port,
		path,
		ip_version,
		healthcheck_enabled,
		...form
	} = values;
	const { interval, timeout, headers, port, ...healthcheckOptions } =
		healthcheck_enabled ? healthcheck : initialState.healthcheck;

	const servicesInfo = services
		.filter((serviceInfo) => serviceInfo.id)
		.map((serviceInfo) => ({
			id: +serviceInfo.id,
			weight: +serviceInfo.weight,
		}));

	const headersInfo = headers
		.filter((headerInfo) => headerInfo.name.trim() && headerInfo.value.trim())
		.reduce((acc: Record<string, string>, curr) => {
			acc[curr.name] = curr.value;
			return acc;
		}, {});

	return {
		...form,
		certificate_id:
			certificate_id && certificate_id !== "none" ? +certificate_id : null,
		insecure: insecure,
		tls_termination: tls_termination,
		cloud_gateway_id: +cloud_gateway_id,
		services: servicesInfo,
		path: path || "/",
		ip_version: +ip_version,
		healthcheck_enabled,
		healthcheck: {
			...healthcheckOptions,
			timeout: timeout ? +timeout : undefined,
			interval: interval ? +interval : undefined,
			headers: headersInfo,
			port: +port || undefined,
		},
		target_port: +target_port || TARGET_PORT,
	};
};

export const servicesToOptions = (
	services: paths["/services"]["get"]["responses"]["200"]["content"]["application/json"],
) =>
	services.map((serviceInfo) => ({
		value: `${serviceInfo.id}`,
		text: `${serviceInfo.name} (${serviceInfo.ext_id})`,
	}));

export const certificatesToOptions = (
	certificates: paths["/certificates"]["get"]["responses"]["200"]["content"]["application/json"],
) =>
	certificates
		.filter((certificate) => certificate.id)
		.map((certificate) => ({
			value: `${certificate.id}`,
			text: certificate.name || "",
		}));

export type Option = {
	value: string;
	text: string;
};

export type RadioOption = {
	value: string | number | boolean;
	text: string;
};

export type ComboboxOption = {
	value: string;
	text: string;
};

export const FIELD_TYPES = {
	INPUT: "INPUT",
	SELECT: "SELECT",
	RADIO: "RADIO",
	CHECKBOX: "CHECKBOX",
	COMBOBOX: "COMBOBOX",
	CONTENT: "CONTENT",
};

export type InputField = {
	type: typeof FIELD_TYPES.INPUT;
	name: string;
	label: string[];
	placeholder: string[];
	description?: string;
	clarification?: string;
	valuesToHide?: string[];
	hidden?: (values: any) => boolean;
};

export type SelectField = {
	type: typeof FIELD_TYPES.SELECT;
	name: string;
	label: string[];
	placeholder: string[];
	description?: string;
	options: Option[];
	clarification?: string;
	valuesToHide?: string[];
	isClearable?: boolean;
	disabled?: boolean;
	hidden?: (values: any) => boolean;
};

export type ComboboxField = {
	type: typeof FIELD_TYPES.SELECT;
	name: string;
	label: string[];
	placeholder: string[];
	description?: string;
	options: ComboboxOption[];
	clarification?: string;
	valuesToHide?: string[];
	isClearable?: boolean;
	hidden?: (values: any) => boolean;
};

export type CheckboxField = {
	type: typeof FIELD_TYPES.CHECKBOX;
	name: string;
	label: string[];
	clarification?: string;
	valuesToHide?: string[];
	description?: string;
	hidden?: (values: any) => boolean;
};

export type RadioField = {
	type: typeof FIELD_TYPES.RADIO;
	name: string;
	label: string[];
	options: RadioOption[];
	clarification?: string;
	valuesToHide?: string[];
	description?: string;
	hidden?: (values: any) => boolean;
};

export type ContentField = {
	type: typeof FIELD_TYPES.CONTENT;
	content: ReactNode | undefined;
	valuesToHide?: string[];
	hidden?: (values: any) => boolean;
};

export type FieldsTypes =
	| CheckboxField
	| SelectField
	| InputField
	| RadioField
	| ContentField;

type Section = {
	title: string;
	description: string;
	fields: Array<FieldsTypes>;
};

export const createFormSections = (dynamicContent: ReactNode[]): Section[] => [
	{
		title: "general",
		description: "",
		fields: [
			{
				type: FIELD_TYPES.INPUT,
				name: "name",
				label: ["name"],
				placeholder: ["my-route"],
				description: "traefikUniqName",
			},
			{
				type: FIELD_TYPES.INPUT,
				name: "hostname",
				label: ["hostname"],
				placeholder: ["www.example.com"],
				description: "traefikPublHostname",
			},
			{
				type: FIELD_TYPES.INPUT,
				name: "path",
				label: ["path", "optional"],
				placeholder: ["/"],
				description: "traefikPath",
			},
			{
				type: FIELD_TYPES.INPUT,
				name: "target_port",
				label: ["targetPort", "optional"],
				placeholder: ["443"],
				description: "traefikTargetPortDescript",
			},
			{
				type: FIELD_TYPES.SELECT,
				name: "cloud_gateway_id",
				label: ["balancer"],
				placeholder: ["none"],
				description: "balancerDescription",
				isClearable: true,
			},
		],
	},
	{
		title: "traefikTargetServices",
		description: "traefikSplitTrafficDescript",
		fields: [
			{
				type: FIELD_TYPES.CONTENT,
				content: dynamicContent[0],
			},
			{
				type: FIELD_TYPES.RADIO,
				name: "ip_version",
				label: ["ipInterface"],
				options: ipOptions,
			},
			{
				type: FIELD_TYPES.CONTENT,
				hidden: (values: any) =>
					values.services.filter((s: { id: string; weight: string }) => s.id)
						.length < 2,
				content: <Admonition message="healthCheckAdm" />,
			},
			{
				type: FIELD_TYPES.CONTENT,
				content: dynamicContent[1],
			},
			{
				type: FIELD_TYPES.CHECKBOX,
				name: "healthcheck_enabled",
				label: ["enabled"],
			},
			{
				type: FIELD_TYPES.INPUT,
				name: "healthcheck.path",
				label: ["path", "optional"],
				clarification: "tooltipPath",
				placeholder: ["/"],
				valuesToHide: ["healthcheck_enabled"],
			},
			{
				type: FIELD_TYPES.SELECT,
				name: "healthcheck.scheme",
				label: ["scheme", "optional"],
				clarification: "tooltipScheme",
				placeholder: ["scheme"],
				valuesToHide: ["healthcheck_enabled"],
				isClearable: true,
			},
			{
				type: FIELD_TYPES.INPUT,
				name: "healthcheck.hostname",
				label: ["hostname", "optional"],
				clarification: "tooltipHostName",
				placeholder: ["enterHostname"],
				valuesToHide: ["healthcheck_enabled"],
			},
			{
				type: FIELD_TYPES.INPUT,
				name: "healthcheck.port",
				label: ["port", "optional"],
				clarification: "tooltipPort",
				placeholder: ["enterPort", "exampleOfPort"],
				valuesToHide: ["healthcheck_enabled"],
			},
			{
				type: FIELD_TYPES.INPUT,
				name: "healthcheck.interval",
				label: ["intervalSec"],
				clarification: "tooltipInterval",
				placeholder: ["enterInterval"],
				valuesToHide: ["healthcheck_enabled"],
			},
			{
				type: FIELD_TYPES.INPUT,
				name: "healthcheck.timeout",
				label: ["timeout"],
				clarification: "tooltipTimeout",
				placeholder: ["enterTimeout"],
				valuesToHide: ["healthcheck_enabled"],
			},
			{
				type: FIELD_TYPES.CONTENT,
				content: dynamicContent[2],
				valuesToHide: ["healthcheck_enabled"],
			},
			{
				type: FIELD_TYPES.RADIO,
				name: "healthcheck.follow_redirects",
				label: ["followRedirects"],
				clarification: "tooltipFollowRedirect",
				options: followRedirectsOptions,
				valuesToHide: ["healthcheck_enabled"],
			},
			{
				type: FIELD_TYPES.SELECT,
				name: "healthcheck.method",
				label: ["method"],
				clarification: "tooltipMethod",
				placeholder: ["enterMethod"],
				valuesToHide: ["healthcheck_enabled"],
			},
		],
	},
	{
		title: "security",
		description: "",
		fields: [
			{
				type: FIELD_TYPES.CHECKBOX,
				name: "isSecure",
				label: ["traefikSecRoute"],
				description: "traefikSecRouteDescript",
			},
			{
				type: FIELD_TYPES.SELECT,
				name: "tls_termination",
				label: ["tlsTermination"],
				placeholder: ["none"],
				valuesToHide: ["isSecure"],
			},
			{
				type: FIELD_TYPES.CONTENT,
				hidden: (values: any) =>
					!(
						values.services.filter((s: { id: string; weight: string }) => s.id)
							.length > 1 &&
						values.tls_termination === TlsTermination.PASSTHROUGH
					),
				content: <Admonition message="passthroughAdm" />,
			},
			{
				type: FIELD_TYPES.SELECT,
				name: "insecure",
				label: ["traefikInsTraffic"],
				placeholder: ["none"],
				description: "traefikInsTrafficDescript",
				valuesToHide: ["isSecure"],
				isClearable: true,
				disabled: false,
			},
			{
				type: FIELD_TYPES.SELECT,
				name: "certificate_id",
				label: ["traefikTlsCertificate"],
				placeholder: ["none"],
				valuesToHide: ["isSecure"],
			},
		],
	},
];

export type FormFieldComponent<T> = {
	error: FieldError | undefined;
	field: ControllerRenderProps<Record<string, string>, string>;
	fieldInfo: T;
};
