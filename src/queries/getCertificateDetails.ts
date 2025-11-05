import { useFetchData } from "container/Api";
import { certificateUrl, getFullPath } from "@/AppConstants";
import type { paths } from "@/schemas/balancer-api";

export const getCertificateDetails = (id: string | number | undefined) =>
	useFetchData<
		paths["/certificates/{id}"]["get"]["responses"]["200"]["content"]["application/json"]
	>({
		endpoint: getFullPath(certificateUrl(id)),
		enabled: !!id,
		gcTime: 0,
	});
