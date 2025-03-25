import { getFullPath } from "@/AppConstants";
import { WEB_ROUTES_SERVICES_FETCH_URL } from "@/AppConstants";
import type { paths } from "@/schemas/balancer-api";
import { useFetchData } from "container/Api";

export const getServicesList = () =>
	useFetchData<
		paths["/services"]["get"]["responses"]["200"]["content"]["application/json"]
	>({
		endpoint: getFullPath(WEB_ROUTES_SERVICES_FETCH_URL),
	});
