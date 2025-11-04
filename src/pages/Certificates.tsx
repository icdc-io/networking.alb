import { Button } from "container/Button";
import ErrorScreen from "container/ErrorScreen";
import { Input } from "container/Input";
import Loader from "container/Loader";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getCertificatesList } from "@/queries/getCertificatesList";
import type { paths } from "@/schemas/balancer-api";
import { onSearch } from "@/utilities/search";
import BalancerApiButton from "../components/BalancerApiButton";
import CertificatesList from "../components/CertificatesList";

const Certificates = () => {
	const { t } = useTranslation();

	const {
		data: certificates,
		isFetching,
		isError,
		refetch,
	} = getCertificatesList();
	const [search, setSearch] = useState("");

	return (
		<>
			<h2 className="page-title">{t("certificates")}</h2>
			<div className="tools">
				<Input
					variant="search"
					placeholder={t("searchField")}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<div className="create-route-buttons">
					<BalancerApiButton name="certificates" />
					<Link to={"create"}>
						<Button>{t("createCertificate")}</Button>
					</Link>
				</div>
			</div>
			{isError ? (
				<ErrorScreen />
			) : isFetching ? (
				<Loader />
			) : certificates ? (
				<CertificatesList
					items={onSearch<
						paths["/certificates"]["get"]["responses"]["200"]["content"]["application/json"][number]
					>(certificates, search)}
					refetch={refetch}
				/>
			) : null}
		</>
	);
};

export default Certificates;
