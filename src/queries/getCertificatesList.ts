import { useFetchData } from "container/Api";
import { CERTIFICATES_FETCH_URL, getFullPath } from "@/AppConstants";
import type { paths } from "@/schemas/balancer-api";

export const getCertificatesList = () =>
	useFetchData<
		paths["/certificates"]["get"]["responses"]["200"]["content"]["application/json"]
	>({
		endpoint: getFullPath(CERTIFICATES_FETCH_URL),
		gcTime: 0,
		staleTime: 0,
	});
