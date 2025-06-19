import { getFullPath } from "@/AppConstants";
import { webRouteUrl } from "@/AppConstants";
import { getCertificateDetails } from "@/queries/getCertificateDetails";
import { getRoutesList } from "@/queries/getRoutesList";
import type { components } from "@/schemas/balancer-api";
import { useMutateData } from "container/Api";
import { Button } from "container/Button";
import { useAppSelector } from "container/ReduxActions";
import { returnBaseUrl } from "container/ReturnBaseUrl";
import { type FC, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { subTitleHealthchek } from "../constants/healthcheck";
import WebRoute from "../static/images/webroutes.svg";
import BalancerApiButton from "./BalancerApiButton";
import DeleteModal, { type ModalRef } from "./DeleteModal";

type Route = components["schemas"]["Route"]["route"];

type InstanceType = Omit<Route, "cloud_gateway">;

type WebRoutesDetailsContent = {
	route: Route;
};

const WebRoutesDetailsContent: FC<WebRoutesDetailsContent> = ({ route }) => {
	const { t } = useTranslation();
	const { data: certificate } = getCertificateDetails(route.certificate_id);
	const user = useAppSelector((state) => state.host.user);
	const baseUrls = useAppSelector((state) => state.host.baseUrls);
	const ref = useRef<ModalRef<InstanceType>>(null);
	const { mutateAsync } = useMutateData({});
	const { refetch } = getRoutesList();
	const navigate = useNavigate();

	const protocol =
		!route?.insecure && !route?.tls_termination ? "http://" : "https://";

	const computeLink = `https://compute.${returnBaseUrl(baseUrls, user.location)}`;

	const getHealthCheckContent = (
		value: string | number | boolean | Record<string, string> | undefined,
	) => ({
		url: (
			<dd>
				<div>
					<a href={`${protocol}${value}`} target="blank">
						{(value as string) || t("none")}
					</a>
				</div>
			</dd>
		),
		boolean: <dd>{value ? t("trueCheck") : t("falseCheck")}</dd>,
	});

	const tableRowHealthCheck = (data: Route) =>
		subTitleHealthchek.map((obj, key) => {
			const path = data.healthcheck
				? (obj.path as keyof typeof data.healthcheck)
				: undefined;
			const value = path ? data.healthcheck?.[path] : undefined;

			if (obj.type === "headers") {
				if (!value) return null;

				const headersObject = value as Record<string, string>;

				return Object.keys(headersObject).map((headerName, key) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<dl key={key} className="flex">
						<dt>
							{t([obj.title])} {headerName}
						</dt>
						<dd>{headersObject[headerName]}</dd>
					</dl>
				));
			}

			return (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<dl key={key} className="flex">
					<dt>{t([obj.title])}</dt>
					{(obj.type &&
						getHealthCheckContent(value)[
							obj.type as keyof typeof getHealthCheckContent
						]) || (
						<dd>{(value as string | number | undefined) || t("none")}</dd>
					)}
				</dl>
			);
		});

	const onDelete =
		(instance: Route) => (_e: React.MouseEvent<HTMLButtonElement>) => {
			if (ref.current) {
				ref.current.handleClick(instance);
			}
		};

	const onDeleteAction = (instance: InstanceType) => {
		return mutateAsync({
			method: "DELETE",
			endpoint: getFullPath(webRouteUrl(instance.id)),
		}).then(() => {
			refetch();
			navigate("..", { relative: "path" });
		});
	};

	return (
		<div className="flex flex-col h-full gap-2 web-route-details">
			<div className="flex justify-between flex-wrap gap-2">
				<div className="flex items-center gap-4">
					<img src={WebRoute} width="41" alt="WebRoute" />
					<h2 className="page-title">{route.name}</h2>
				</div>
				<div className="create-route-buttons">
					<BalancerApiButton name="routesId" />
					<Link to={"edit"}>
						<Button color="black" variant="outline">
							{t("edit")}
						</Button>
					</Link>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<h3 className="mt-2">{t("details")}</h3>
				<dl className="flex flex-wrap gap-2">
					<dt>{t("hostname")}</dt>
					<dd>
						<a href={`${protocol}${route.hostname}`} target="blank">
							{route.hostname}
						</a>
					</dd>
				</dl>
				<dl className="flex flex-wrap gap-2">
					<dt>{t("balancer")}</dt>
					<dd>
						{!route.cloud_gateway_id
							? t("none")
							: `${route.cloud_gateway.cloudgw_instance} (${route.cloud_gateway.name})`}
					</dd>
				</dl>
				<dl className="flex flex-wrap gap-2">
					<dt>{t("path")}</dt>
					<dd>{route.path === "" ? t("none") : route.path}</dd>
				</dl>
				<dl className="flex flex-wrap gap-2">
					<dt>{t("service")}</dt>
					<dd>
						{route.services && route.services.length > 0
							? route.services.map((el, i) => (
									<a
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										key={i}
										href={`${computeLink}/ui/service/services/${el.ext_id}`}
										target="_blank"
										rel="noreferrer"
									>
										{`${el.name} (${el.ext_id})${i !== (route.services ? route.services.length - 1 : 0) ? "," : ""}`}
									</a>
								))
							: t("none")}
					</dd>
				</dl>
				<dl className="flex flex-wrap gap-2">
					<dt>{t("targetPort")}</dt>
					<dd>{route.target_port}</dd>
				</dl>
			</div>

			{route.healthcheck_enabled && (
				<div className="flex flex-col gap-2">
					<h3 className="mt-2">{t("healthCheck")}</h3>
					{tableRowHealthCheck(route)}
				</div>
			)}

			<div className="flex flex-col gap-2">
				<h3 className="mt-2">{t("tlcSetting")}</h3>
				{!route.tls_termination && (
					<div className="flex">
						<div>{t("tlsNotEnabled")}</div>
					</div>
				)}
				<dl className="flex flex-wrap gap-2">
					<dt>{t("tlsType")}:</dt>
					<dd>{route.tls_termination || t("none")}</dd>
				</dl>
				<dl className="flex flex-wrap gap-2">
					<dt>{t("insecureTraffic")}:</dt>
					<dd>{route.insecure || t("none")}</dd>
				</dl>
				<dl className="flex flex-wrap gap-2">
					<dt>{t("certificate")}:</dt>
					<dd>{route.certificate_id ? certificate?.name : t("none")}</dd>
				</dl>
			</div>

			<div className="network-delete flex-wrap gap-2">
				<div>
					<b>{`${t("delete")} ${t("webRoutes")}`.toUpperCase()}</b>
					<p>{t("cannotBeUndone")}</p>
				</div>
				<div className="delete-webroute-action">
					<Button variant="outline" color="red" onClick={onDelete(route)}>
						{t("delete")}
					</Button>
				</div>
			</div>
			<DeleteModal
				ref={ref}
				title="deleteRoute"
				description={"deleteWebRoute"}
				onSubmit={onDeleteAction}
			/>
		</div>
	);
};

export default WebRoutesDetailsContent;
