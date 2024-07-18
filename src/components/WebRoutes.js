import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import WebRoutesList from "./WebRoutesList";
import {
  fetchWebRoutes,
  deleteWebRouteReset,
  updateWebRouteReset,
  fetchGateways,
} from "../AppActions";
import { Grid, Header } from "semantic-ui-react";
import LoadBalancerHeaderContent from "./LoadBalancerHeaderContent";
import CopyPublicHostname from "./CopyPublicHostname";
import { useTranslation } from "react-i18next";

const ContentPage = React.lazy(() => import("container/ContentPage"));

const WebRoutes = () => {
  const { t } = useTranslation();

  const routes = useSelector((state) => state.BalancerStore.traefikRoutes);
  const routesFetchStatus = useSelector(
    (state) => state.BalancerStore.traefikRoutesStatus,
  );
  const user = useSelector((state) => state.host.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchWebRoutes());
    dispatch(deleteWebRouteReset());
    dispatch(updateWebRouteReset());
    dispatch(fetchGateways());
  }, [dispatch, user]);

  const isNoData = routes.length < 1;

  return (
    <>
      {isNoData && (
        <Grid style={{ padding: "0 16px 20px" }}>
          <Grid.Row>
            <Header
              as="h4"
              className="webRoutesHeader"
              content={t("loadBalancer")}
            />
          </Grid.Row>
          <Grid.Row style={{ padding: "0" }}>
            <div className="loadBalancerDescription" style={{ margin: "0px" }}>
              <p>{t("traefikDescriptionOne")}</p>
              <div className="publicHostname">
                <span>{t("publicHostname")}</span>
                <CopyPublicHostname />
              </div>
              <p>{t("traefikDescriptionTwo")}</p>
            </div>
          </Grid.Row>
        </Grid>
      )}
      <ContentPage
        statuses={[routesFetchStatus]}
        pageData={routes}
        title={"loadBalancer"}
        componentDataList={WebRoutesList}
        noContentMessage={"noWebRoutes"}
      >
        <LoadBalancerHeaderContent
          isNoData={isNoData}
          isWebRoutes
          title={"loadBalancer"}
        />
      </ContentPage>
    </>
  );
};

export default WebRoutes;
