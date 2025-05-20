import { getFullPath } from "@/AppConstants";
import { WEB_ROUTES_FETCH_URL } from "@/AppConstants";
import type { WebRoute } from "@/entities/WebRoute";
import { useFetchData } from "container/Api";

export const getRoutesList = () =>
	useFetchData<WebRoute[]>({
		endpoint: getFullPath(WEB_ROUTES_FETCH_URL),
	});
