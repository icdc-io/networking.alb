import { getFullPath } from "@/AppConstants";
import { webRouteUrl } from "@/AppConstants";
import type { paths } from "@/schemas/balancer-api";
import { useFetchData } from "container/Api";

export const getRouteDetails = (id: string | undefined) =>
	useFetchData<
		paths["/routes/{id}"]["get"]["responses"]["200"]["content"]["application/json"],
		paths["/routes/{id}"]["get"]["responses"]["200"]["content"]["application/json"]["route"]
	>({
		endpoint: getFullPath(webRouteUrl(id)),
		select: (data) => data.route,
		enabled: !!id,
	});
