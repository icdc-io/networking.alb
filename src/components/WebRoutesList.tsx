import { useMutateData } from "container/Api";
import OptionsMenu from "container/OptionsMenu";
import Popup from "container/Popup";
import { useAppSelector } from "container/ReduxActions";
import { returnBaseUrl } from "container/ReturnBaseUrl";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "container/Table";
import { type FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { getFullPath, webRouteUrl } from "@/AppConstants";
import type { WebRoute } from "@/entities/WebRoute";
import WebRouteIcon from "../static/images/webroutes.svg";
import { returnServiceInfo } from "../utilities/search";
import DeleteModal, { type ModalRef } from "./DeleteModal";

type WebRoutesList = {
	items: WebRoute[];
	refetch: () => void;
};

const headerRow = [
	"name",
	"hostname",
	"targetPort",
	"tlsTermination",
	"service",
	"balancer",
	"",
];

const order = ["descending", "ascending"] as const;
type InstanceType = Omit<WebRoute, "cloud_gateway">;

const WebRoutesList: FC<WebRoutesList> = ({ items, refetch }) => {
	const { t } = useTranslation();

	const [filteredData, setFilteredData] = useState(items);
	const user = useAppSelector((state) => state.host.user);
	const baseUrls = useAppSelector((state) => state.host.baseUrls);
	const navigate = useNavigate();
	const ref = useRef<ModalRef<InstanceType>>(null);
	const { mutateAsync } = useMutateData({});

	const [sortUp, setSortUp] = useState(2);

	useEffect(() => {
		setFilteredData(items);
	}, [items]);

	const computeUrl = `https://compute.${returnBaseUrl(baseUrls, user.location)}/ui/service/services/`;
	const service = (route: WebRoute) =>
		route.services
			?.map((e) => (
				<div key={e.id}>
					<a href={`${computeUrl}${e.ext_id}`} target="_blank" rel="noreferrer">
						{returnServiceInfo(e)}
					</a>
					<br />
				</div>
			))
			.slice();

	const onEdit = (instance: WebRoute) => (_e: Event) =>
		navigate(`${instance.id}/edit`);

	const onDelete = (instance: WebRoute) => (_e: Event) => {
		if (ref.current) {
			ref.current.handleClick(instance);
		}
	};

	const options = [
		{
			text: "edit",
			action: onEdit,
		},
		{
			text: "delete",
			action: onDelete,
			color: "red" as const,
		},
	];

	const onDeleteAction = (instance: InstanceType) => {
		return mutateAsync({
			method: "DELETE",
			endpoint: getFullPath(webRouteUrl(instance.id)),
		}).then(refetch);
	};

	const isItemsExists = filteredData.length > 0;

	const routes = isItemsExists ? (
		filteredData.map((el: WebRoute) => {
			return (
				<TableRow key={el.id}>
					<TableCell width={3}>
						<div className="name-wrapper">
							<img src={WebRouteIcon} width="35" alt="WebRoute" />
							<Link to={`${el.id}`}>{el.name}</Link>
						</div>
					</TableCell>

					<TableCell width={2}>{el.hostname}</TableCell>
					<TableCell width={1}>
						{el.target_port ? el.target_port : "—"}
					</TableCell>
					<TableCell width={2}>
						{el.tls_termination ? el.tls_termination : "—"}
					</TableCell>
					<TableCell width={4}>
						<div className="td-wrapper">
							{el.services && el.services.length > 0 ? (
								<a
									href={`${computeUrl}${el.services[0]?.ext_id}`}
									target="_blank"
									rel="noreferrer"
								>
									{`${el.services[0].name} (${el.services[0].ext_id})`}
								</a>
							) : (
								"—"
							)}
							{el.services && el.services.length > 0 && (
								<Popup className="popup-window" content={service(el)}>
									<button type="button" className="popup-dots">
										...
									</button>
								</Popup>
							)}
						</div>
					</TableCell>
					<TableCell width={4}>
						{el.cloud_gateway
							? `${el.cloud_gateway.cloudgw_instance} (${el.cloud_gateway.name})`
							: "—"}
					</TableCell>
					<TableCell width={1} align="right">
						<OptionsMenu options={options} instance={el} />
					</TableCell>
				</TableRow>
			);
		})
	) : (
		<TableRow>
			<TableCell colSpan={headerRow.length} align="center">
				<b>{t("listEmpty")}</b>
			</TableCell>
		</TableRow>
	);

	const onSort = () => {
		setFilteredData(
			items.sort((a, b) =>
				sortUp
					? (a.cloud_gateway_id || 0) - (b.cloud_gateway_id || 0)
					: (b.cloud_gateway_id || 0) - (a.cloud_gateway_id || 0),
			),
		);
		setSortUp((prev) => +!prev);
	};

	const headers = headerRow.map((el) => {
		if (el === "balancer") {
			return (
				<TableHead key={el} sorted={order[+sortUp]} onSort={onSort}>
					{t(el)}
				</TableHead>
			);
		}
		return <TableHead key={el}>{t(el)}</TableHead>;
	});

	return (
		<div className="table-container h-full">
			<Table
				containerClassName={isItemsExists ? undefined : "h-full"}
				className="h-full"
			>
				<TableHeader>
					<TableRow>{headers}</TableRow>
				</TableHeader>
				<TableBody>{routes}</TableBody>
			</Table>
			<DeleteModal
				ref={ref}
				title="deleteRoute"
				description={"deleteWebRoute"}
				onSubmit={onDeleteAction}
			/>
		</div>
	);
};

export default WebRoutesList;
