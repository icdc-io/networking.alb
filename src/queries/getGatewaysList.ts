import { useFetchData } from "container/Api";
import { getFullPath, WEB_ROUTES_GATEWAYS_FETCH_URL } from "@/AppConstants";
import type { paths } from "@/schemas/balancer-api";

export const getGatewaysList = () =>
	useFetchData<
		paths["/gateways"]["get"]["responses"]["200"]["content"]["application/json"]
	>({
		endpoint: getFullPath(WEB_ROUTES_GATEWAYS_FETCH_URL),
	});
