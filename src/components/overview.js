import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Segment } from "semantic-ui-react";
import TabsLayout from "./tabsLayout";
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
  const { t } = useTranslation();

  const menuItems = [
    {
      name: t("webRoutes"),
      path: webRoutesPath("load_balancer"),
      Component: WebRoutes,
    },
    {
      name: t("certificates"),
      path: certificatesPath("load_balancer"),
      Component: Certificates,
    },
  ];

  return (
    <>
      <TabsLayout menuItems={menuItems} />
      <Segment attached="bottom">
        <Routes>
          {routes.map((routeInfo, key) => (
            <Route key={key} exact {...routeInfo} />
          ))}
          <Route
            path="*"
            element={<Navigate to={menuItems[0].path} replace />}
          />
        </Routes>
      </Segment>
    </>
  );
};

export default LoadBalancerOverview;
