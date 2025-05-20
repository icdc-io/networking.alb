import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
	certificateDetailsPath,
	certificatesPath,
	createCertificatePath,
	createroutePath,
	detailsPath,
	editCertificatePath,
	editroutePath,
	webRoutesPath,
} from "../constants/routes";
import RootElement from "./rootElement";

const CreateWebRoute = React.lazy(() => import("@/pages/CreateWebRoute"));
const EditWebRoute = React.lazy(() => import("@/pages/EditWebRoute"));
const WebRoutes = React.lazy(() => import("../pages/WebRoutes"));
const Certificates = React.lazy(() => import("../pages/Certificates"));
const WebRoutesDetails = React.lazy(() => import("./WebRoutesDetails"));
const CreateEditCertificate = React.lazy(
	() => import("./CreateEditCertificate"),
);
const CertificateDetails = React.lazy(() => import("./CertificateDetails"));

const routes = [
	{
		path: webRoutesPath(),
		Component: WebRoutes,
	},
	{
		path: createroutePath(),
		Component: CreateWebRoute,
	},
	{
		path: editroutePath(),
		Component: EditWebRoute,
	},
	{
		path: detailsPath(),
		Component: WebRoutesDetails,
	},
	{
		path: certificatesPath(),
		Component: Certificates,
	},
	{
		path: createCertificatePath(),
		Component: CreateEditCertificate,
	},
	{
		path: editCertificatePath(),
		Component: CreateEditCertificate,
	},
	{
		path: certificateDetailsPath(),
		Component: CertificateDetails,
	},
];

const LoadBalancerOverview = () => {
	return (
		<div className="networking_balancer h-full">
			<React.Suspense fallback={null}>
				<Routes>
					<Route path="/" Component={RootElement}>
						{routes.map((routeInfo) => (
							<Route key={routeInfo.path} {...routeInfo} />
						))}
						<Route
							path="*"
							element={<Navigate to={webRoutesPath()} replace />}
						/>
					</Route>
				</Routes>
			</React.Suspense>
		</div>
	);
};

export default LoadBalancerOverview;
