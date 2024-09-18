import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Header, Icon, Input, Loader } from "semantic-ui-react";
import {
  deleteWebRouteReset,
  fetchGateways,
  fetchWebRoutes,
  updateWebRouteReset,
} from "../AppActions";
import CopyPublicHostname from "./CopyPublicHostname";
import LoadBalancerHeaderContent from "./LoadBalancerHeaderContent";
import WebRoutesList from "./WebRoutesList";

const ApiButton = React.lazy(() => import("container/ApiButton"));
const Popup = React.lazy(() => import("container/Popup"));
const ErrorScreen = React.lazy(() => import("container/ErrorScreen"));

const WebRoutes = () => {
  const { t } = useTranslation();

  const routes = useSelector((state) => state.BalancerStore.traefikRoutes);
  const routesFetchStatus = useSelector(
    (state) => state.BalancerStore.traefikRoutesStatus,
  );
  const traefikGateways = useSelector(
    (state) => state.BalancerStore.traefikGateways,
  );
  const traefikGatewaysStatus = useSelector(
    (state) => state.BalancerStore.traefikGatewaysStatus,
  );
  const baseUrls = useSelector((state) => state.host.baseUrls);

  const user = useSelector((state) => state.host.user);
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchWebRoutes());
    dispatch(deleteWebRouteReset());
    dispatch(updateWebRouteReset());
    dispatch(fetchGateways());
  }, [dispatch, user]);

  const isError = routesFetchStatus === "rejected";

  const isLoading = routesFetchStatus === "pending" || !routesFetchStatus;

  const isNoData = routes.length < 1;

  return (
    <>
      <h4>{t("loadBalancer")}</h4>
      <div className="loadBalancerDescription">
        <p>{t("traefikDescriptionOne")}</p>
        <div className="publicHostname">
          <span>{t("publicHostname")}</span>
          <CopyPublicHostname />
        </div>
        <p>{t("traefikDescriptionTwo")}</p>
      </div>
      <Header as="h4" className="webRoutesHeader" content={t("webRoutes")} />
      {isError ? (
        <ErrorScreen />
      ) : isLoading ? (
        <Loader active inline="centered" />
      ) : isNoData ? (
        <LoadBalancerHeaderContent isNoData={isNoData} title={"certificates"} />
      ) : (
        <>
          <div className="tools">
            <Input
              icon="search"
              iconPosition="left"
              placeholder={t("searchField")}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
            />
            <div className="create-route-buttons">
              {!(
                traefikGateways.length < 1 ||
                traefikGatewaysStatus !== "fulfilled"
              ) && (
                <React.Suspense fallback={null}>
                  <ApiButton
                    element="routes"
                    user={user}
                    locationUrl={baseUrls[user.location]}
                  />
                </React.Suspense>
              )}

              {traefikGateways.length < 1 ||
              traefikGatewaysStatus !== "fulfilled" ? (
                <Popup content={t("balancerPopup")} className="vpn">
                  <button
                    className="ui blue small button primary disabled-btn"
                    type="button"
                  >
                    {t("createWebRoute")}
                    <Icon
                      name="question circle outline"
                      size="large"
                      className="info-icon"
                    />
                  </button>
                </Popup>
              ) : (
                <Link to={"create"}>
                  <Button primary size="medium">
                    {t("createWebRoute")}
                  </Button>{" "}
                </Link>
              )}
            </div>
          </div>
          <WebRoutesList items={routes} />
        </>
      )}
    </>
  );
};

export default WebRoutes;
