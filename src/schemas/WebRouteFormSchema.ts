import isFQDN from "validator/lib/isFQDN";
import { z } from "zod";

const MIN_LENGTH = 1;

const isValidHostname = (hostname: string) => isFQDN(hostname);

const portValidation =
	/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;
const weightValidation = (value: string) => {
	if (!value) return false;
	return /^(100|[1-9][0-9]?)$/.test(value);
};

const isTargetPortValid = (port: string) =>
	port ? portValidation.test(port) : true;

export const WebRouteFormSchema = z
	.object({
		name: z.string().min(MIN_LENGTH, {
			message: "",
		}),
		hostname: z
			.string()
			.min(MIN_LENGTH, {
				message: "",
			})
			.refine(isValidHostname, {
				message: "",
			}),
		path: z.string(),
		target_port: z.string().refine(isTargetPortValid, {
			message: "",
		}),
		healthcheck_enabled: z.boolean(),
		isSecure: z.boolean(),
		tls_termination: z.string(),
		insecure: z.string(),
		ip_version: z.string(),
		certificate_id: z.string(),
		cloud_gateway_id: z.string().min(MIN_LENGTH, {
			message: "",
		}),
		destination_proto: z.string(),
		source_proto: z.string(),
		healthcheck: z.object({
			path: z.string(),
			port: z.string(),
			hostname: z.string(),
			interval: z.string(),
			timeout: z.string(),
			follow_redirects: z.boolean(),
			method: z.string(),
			scheme: z.string(),
			headers: z.array(
				z.object({
					name: z.string(),
					value: z.string(),
				}),
			),
		}),
		services: z.array(
			z.object({
				id: z.string(),
				weight: z.string(),
			}),
		),
	})
	.superRefine((data, ctx) => {
		const services = data.services.filter((serviceInfo) => serviceInfo.id);
		if (services.length <= 1) return true;
		const index = services.findIndex((serviceInfo) => {
			return !weightValidation(serviceInfo.weight);
		});
		if (index === -1) return;
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: [`services.${index}.weight`],
			message: "",
		});
	});
