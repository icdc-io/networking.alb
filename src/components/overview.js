import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  certificatesPath,
  webRoutesPath,
  createroutePath,
  editroutePath,
  createCertificatePath,
  editCertificatePath,
  certificateDetailsPath,
  detailsPath,
} from "../constants/routes";

const WebRoutes = React.lazy(() => import("./WebRoutes"));
const Certificates = React.lazy(() => import("./Certificates"));
const CreateEditRoute = React.lazy(() => import("./CreateEditRoute"));
const WebRoutesDetails = React.lazy(() => import("./WebRoutesDetails"));
const CreateEditSertificate = React.lazy(
  () => import("./CreateEditSertificate"),
);
const CertificateDetails = React.lazy(() => import("./certificateDetailsPath"));

const routes = [
  {
    path: webRoutesPath(),
    Component: WebRoutes,
  },
  {
    path: createroutePath(),
    Component: CreateEditRoute,
  },
  {
    path: editroutePath(),
    Component: CreateEditRoute,
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
    Component: CreateEditSertificate,
  },
  {
    path: editCertificatePath(),
    Component: CreateEditSertificate,
  },
  {
    path: certificateDetailsPath(),
    Component: CertificateDetails,
  },
];

const LoadBalancerOverview = () => {
  return (
    <React.Suspense fallback={null}>
      <Routes>
        {routes.map((routeInfo, key) => (
          <Route key={key} exact {...routeInfo} />
        ))}
        <Route path="*" element={<Navigate to={webRoutesPath()} replace />} />
      </Routes>
    </React.Suspense>
  );
};

export default LoadBalancerOverview;
