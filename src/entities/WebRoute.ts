import type { paths } from "@/schemas/balancer-api";

export type WebRoutesResponse =
	paths["/routes"]["get"]["responses"]["200"]["content"]["application/json"];

export type WebRoute =
	paths["/routes"]["get"]["responses"]["200"]["content"]["application/json"][number]["route"];
