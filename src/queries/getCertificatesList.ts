import { getFullPath } from "@/AppConstants";
import { CERTIFICATES_FETCH_URL } from "@/AppConstants";
import type { paths } from "@/schemas/balancer-api";
import { useFetchData } from "container/Api";

export const getCertificatesList = () =>
	useFetchData<
		paths["/certificates"]["get"]["responses"]["200"]["content"]["application/json"]
	>({
		endpoint: getFullPath(CERTIFICATES_FETCH_URL),
	});
