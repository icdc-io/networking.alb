import { z } from "zod";

const MIN_LENGTH = 1;

export const CertificateForm = z.object({
	name: z.string().min(MIN_LENGTH, {
		message: "required",
	}),
	cert: z.string(),
	key: z.string(),
	ca: z.string(),
	dest_ca: z.string(),
	owner: z.any(),
});
