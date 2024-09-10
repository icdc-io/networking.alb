import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Grid, Icon, Popup } from "semantic-ui-react";
import { createCertificatePath, createroutePath } from "../constants/routes";
const ApiButton = React.lazy(() => import("container/ApiButton"));

const ItemHeader = React.lazy(() => import("container/networking/ItemHeader"));

const LoadBalancerHeaderContent = ({ isNoData, isWebRoutes, title }) => {
  const { t } = useTranslation();
  const traefikGateways = useSelector(
    (state) => state.BalancerStore.traefikGateways,
  );
  const traefikGatewaysStatus = useSelector(
    (state) => state.BalancerStore.traefikGatewaysStatus,
  );
  const user = useSelector((state) => state.host.user);
  const baseUrls = useSelector((state) => state.host.baseUrls);

  return (
    <Grid.Row
      className="content-page__header"
      style={isNoData ? { paddingTop: isWebRoutes ? "0px" : "14px" } : {}}
    >
      <ItemHeader
        title={isNoData && isWebRoutes ? t("webRoutes") : t(title)}
        traefik={true}
      />
      <div className="content-page__header_actions">
        {((isNoData &&
          isWebRoutes &&
          traefikGateways.length > 0 &&
          traefikGatewaysStatus === "fulfilled") ||
          (!isWebRoutes && isNoData)) && (
          <ApiButton
            element={isWebRoutes ? "routes" : "certificates"}
            user={user}
            locationUrl={baseUrls[user.location]}
          />
        )}
        {isNoData &&
          isWebRoutes &&
          (traefikGateways.length < 1 ||
            traefikGatewaysStatus !== "fulfilled") && (
            <Popup
              on="hover"
              pinned
              trigger={
                <Button className="disabled-btn" primary size="medium">
                  {t("createWebRoute")}
                  <Icon
                    name="question circle outline"
                    size="large"
                    className="info-icon"
                  />
                </Button>
              }
              inverted
              className="vpn"
              position="top right"
            >
              {t("balancerPopup")}
            </Popup>
          )}
        {isNoData &&
          isWebRoutes &&
          traefikGateways.length > 0 &&
          traefikGatewaysStatus === "fulfilled" && (
            <Link to={createroutePath()}>
              <Button
                primary
                size="medium"
                style={!isWebRoutes ? { marginTop: "12px" } : {}}
              >
                {t("createWebRoute")}
              </Button>
            </Link>
          )}
        {isNoData && !isWebRoutes && (
          <Link to={createCertificatePath()}>
            <Button primary size="medium">
              {t("createCertificate")}
            </Button>
          </Link>
        )}
      </div>
    </Grid.Row>
  );
};

LoadBalancerHeaderContent.propTypes = {
  isNoData: PropTypes.bool,
  isWebRoutes: PropTypes.bool,
  title: PropTypes.string,
};

export default LoadBalancerHeaderContent;
