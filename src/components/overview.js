import React from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
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
import { useTranslation } from "react-i18next";
import TabsLayout from "./tabsLayout";
import { Segment } from "semantic-ui-react";

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

const RootElement = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isRootBalancerPath =
    location.pathname.split("/").filter((route) => route).length < 3;

  if (isRootBalancerPath) return <Navigate to={webRoutesPath()} replace />;

  const menuItems = [
    {
      name: t("webRoutes"),
      path: webRoutesPath(),
    },
    {
      name: t("certificates"),
      path: certificatesPath(),
    },
  ];

  return (
    <>
      <TabsLayout menuItems={menuItems} />
      <Segment attached="bottom">
        <Outlet />
      </Segment>
    </>
  );
};

const LoadBalancerOverview = () => {
  return (
    <React.Suspense fallback={null}>
      <Routes>
        <Route path="/" Component={RootElement}>
          {routes.map((routeInfo, key) => (
            <Route key={key} {...routeInfo} />
          ))}
          <Route path="*" element={<Navigate to={webRoutesPath()} replace />} />
        </Route>
      </Routes>
    </React.Suspense>
  );
};

export default LoadBalancerOverview;
