import { getFullPath } from "@/AppConstants";
import { certificateUrl } from "@/AppConstants";
import type { paths } from "@/schemas/balancer-api";
import { useFetchData } from "container/Api";

export const getCertificateDetails = (id: string | number | undefined) =>
	useFetchData<
		paths["/certificates/{id}"]["get"]["responses"]["200"]["content"]["application/json"]
	>({
		endpoint: getFullPath(certificateUrl(id)),
		enabled: !!id,
	});
