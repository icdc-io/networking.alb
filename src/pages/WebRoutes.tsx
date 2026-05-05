import { Button } from "container/Button";
import ErrorScreen from "container/ErrorScreen";
import { Input } from "container/Input";
import Loader from "container/Loader";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { WebRoute } from "@/entities/WebRoute";
import { getRoutesList } from "@/queries/getRoutesList";
import { onSearch } from "@/utilities/search";
import BalancerApiButton from "../components/BalancerApiButton";
import CopyPublicHostname from "../components/CopyPublicHostname";
import WebRoutesList from "../components/WebRoutesList";

const WebRoutes = () => {
	const { t } = useTranslation();
	const { data: routes = [], isError, isFetching, refetch } = getRoutesList();
	const [search, setSearch] = useState("");

	return (
		<>
			<h2 className="page-title">{t("loadBalancer")}</h2>
			<div className="loadBalancerDescription">
				<p>{t("traefikDescriptionOne")}</p>
				<div className="publicHostname">
					<span>{t("publicHostname")}</span>
					<CopyPublicHostname />
				</div>
				<p>{t("traefikDescriptionTwo")}</p>
			</div>
			<h3 className="webRoutesHeader mt-4">{t("webRoutes")}</h3>
			<div className="tools">
				<Input
					variant="search"
					placeholder={t("searchField")}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<div className="create-route-buttons">
					<BalancerApiButton name="routes" />
					<Link to={"create"}>
						<Button>{t("createWebRoute")}</Button>
					</Link>
				</div>
			</div>
			{isError ? (
				<ErrorScreen />
			) : isFetching ? (
				<Loader />
			) : (
				<WebRoutesList
					items={onSearch<WebRoute>(routes, search)}
					refetch={refetch}
				/>
			)}
		</>
	);
};

export default WebRoutes;
