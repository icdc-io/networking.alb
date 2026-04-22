import { useFetchData } from "container/Api";
import { getFullPath, WEB_ROUTES_FETCH_URL } from "@/AppConstants";
import type { WebRoute } from "@/entities/WebRoute";

export const getRoutesList = () =>
	useFetchData<WebRoute[]>({
		endpoint: getFullPath(WEB_ROUTES_FETCH_URL),
		gcTime: 0,
		staleTime: 0,
	});
