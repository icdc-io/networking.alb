import type { paths } from "@/schemas/balancer-api";

export type Certificate =
	paths["/certificates/{id}"]["get"]["responses"]["200"]["content"]["application/json"];
