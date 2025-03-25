export const WEB_ROUTES_FETCH = "WEB_ROUTES_FETCH";
export const WEB_ROUTE_FETCH = "WEB_ROUTE_FETCH";
export const WEB_ROUTES_SERVICES_FETCH = "WEB_ROUTES_SERVICES_FETCH";
export const WEB_ROUTES_FETCH_URL = "/routes";
export const WEB_ROUTES_SERVICES_FETCH_URL = "/services";
export const WEB_ROUTE_DELETE = "WEB_ROUTE_DELETE";
export const WEB_ROUTE_DELETE_RESET = "WEB_ROUTE_DELETE_RESET";
export const WEB_ROUTE_CREATE = "WEB_ROUTE_CREATE";
export const WEB_ROUTE_UPDATE = "WEB_ROUTE_UPDATE";
export const WEB_ROUTE_UPDATE_RESET = "WEB_ROUTE_UPDATE_RESET";
export const webRouteUrl = (id: string | number | undefined) => `/routes/${id}`;

export const WEB_ROUTES_GATEWAYS_FETCH = "WEB_ROUTES_GATEWAYS_FETCH";
export const WEB_ROUTES_GATEWAYS_FETCH_URL = "/gateways";

export const CERTIFICATES_FETCH = "CERTIFICATES__FETCH";
export const CERTIFICATE_FETCH = "CERTIFICATE__FETCH";
export const CERTIFICATE_DELETE_RESET = "CERTIFICATE_DELETE_RESET";
export const CERTIFICATES_FETCH_URL = "/certificates";
export const CERTIFICATE_DELETE = "CERTIFICATES__DELETE";
export const CERTIFICATE_CREATE = "CERTIFICATES__CREATE";
export const CERTIFICATE_UPDATE = "CERTIFICATE_UPDATE";
export const certificateUrl = (id: string | number | undefined) =>
	`/certificates/${id}`;
export const getFullPath = (url: string, id = "") =>
	`/api/traefik_manager/v1${url}/${id}`;
