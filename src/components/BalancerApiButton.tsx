import ApiButton, { ActionTypes } from "container/ApiButton";
import type { FC } from "react";
import { getFullPath } from "../AppConstants";

const routeCreate = {
	route: {
		name: "route_name",
		hostname: "acc.vpn.loc.icdc.io",
		target_port: "443",
		tls_termination: "re-encrypt",
		owner: " user@example.com",
		cloud_gateway_id: "1",
		path: "/",
		source_proto: "tcp",
		destination_proto: "tcp",
		ip_version: "4",
		services: [
			{
				id: "1",
			},
		],
		certificate_id: "1",
		insecure: "redirect",
	},
};

const certificateCreate = {
	name: "test.zby.icdc.io",
	cert: `-----BEGIN CERTIFICATE-----
      /*certificate content here*/
      -----END CERTIFICATE-----`,
	key: `-----BEGIN PRIVATE KEY-----
      /*private key content here*/
      -----END PRIVATE KEY-----`,
	ca: "",
	dest_ca: "",
	owner: " user@example.com",
};

const apiButtonInfo = {
	routesId: {
		createInfo: routeCreate,
		url: getFullPath("/routes", ":id"),
		deleteUrl: getFullPath("/routes", ":id"),
	},
	routes: {
		createInfo: routeCreate,
		url: getFullPath("/routes", ""),
		deleteUrl: getFullPath("/routes", ":id"),
	},
	certificates: {
		createInfo: certificateCreate,
		url: getFullPath("/certificates", ""),
		deleteUrl: getFullPath("/certificates", ":id"),
	},
	certificate: {
		createInfo: certificateCreate,
		url: getFullPath("/certificates", ":id"),
		deleteUrl: getFullPath("/certificates", ":id"),
	},
} as const;

type BalancerApiButton = {
	name: keyof typeof apiButtonInfo;
};

const BalancerApiButton: FC<BalancerApiButton> = ({ name }) => {
	if (!name) return null;

	const info = apiButtonInfo[name];

	const headers = [
		["x-miq-group", "%ACCOUNT.%ROLE"],
		["x-icdc-account", "%ACCOUNT"],
		["x-icdc-role", "%ROLE"],
	];
	const TOKEN = { actionType: ActionTypes.TOKEN };
	const GET = { actionType: ActionTypes.GET, headers, url: info.url };
	const CREATE = {
		actionType: ActionTypes.CREATE,
		headers,
		url: info.url,
		body: JSON.stringify(info.createInfo),
	};
	const DELETE = {
		actionType: ActionTypes.DELETE,
		headers,
		url: info.deleteUrl,
	};

	const actions = [TOKEN, GET, CREATE, DELETE];

	return <ApiButton actions={actions} />;
};

export default BalancerApiButton;
