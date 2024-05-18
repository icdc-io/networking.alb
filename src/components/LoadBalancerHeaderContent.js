import React from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Grid, Button, Popup, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { createCertificatePath, createroutePath } from "../constants/routes";
import { useSelector } from "react-redux";
const ApiButton = React.lazy(() => import("container/ApiButton"));

const ItemHeader = React.lazy(() => import("container/ItemHeader"));

const LoadBalancerHeaderContent = ({ t, isNoData, isWebRoutes, title }) => {
    const { menuGroup } = useParams();
    const traefikGateways = useSelector((state) => state.BalancerStore.traefikGateways);
    const traefikGatewaysStatus = useSelector((state) => state.BalancerStore.traefikGatewaysStatus);
    const user = useSelector((state) => state.host.user);
    const baseUrls = useSelector((state) => state.host.baseUrls);

    return (
        <Grid.Row className="content-page__header" style={isNoData ? { paddingTop: isWebRoutes ? "0px" : "14px" } : {}}>
            <ItemHeader title={isNoData && isWebRoutes ? t("webRoutes") : t(title)} traefik={true} />
            <div className="content-page__header_actions">
                {((isNoData && isWebRoutes && traefikGateways.length > 0 && traefikGatewaysStatus === "fulfilled") || (!isWebRoutes && isNoData)) && <ApiButton element={isWebRoutes ? "routes" : "certificates"} item={{ destination: "10.112.0.1/24", nexthop: "0.0.0.0" }} user={user} locationUrl={baseUrls[user.location]} />}
                {isNoData && isWebRoutes && (traefikGateways.length < 1 || traefikGatewaysStatus !== "fulfilled") && (
                    <Popup
                        on="hover"
                        pinned
                        trigger={
                            <Button className="disabled-btn" primary size="medium">
                                {t("createWebRoute")}
                                <Icon name="question circle outline" size="large" className="info-icon" />
                            </Button>
                        }
                        inverted
                        className="vpn"
                        position="top right"
                    >
                        {t("balancerPopup")}
                    </Popup>
                )}
                {isNoData && isWebRoutes && traefikGateways.length > 0 && traefikGatewaysStatus === "fulfilled" && (
                    <Link to={createroutePath(menuGroup)}>
                        <Button primary size="medium" style={!isWebRoutes ? { marginTop: "12px" } : {}}>
                            {t("createWebRoute")}
                        </Button>
                    </Link>
                )}
                {isNoData && !isWebRoutes && (
                    <Link to={createCertificatePath(menuGroup)}>
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
    t: PropTypes.func,
    isNoData: PropTypes.bool,
    isWebRoutes: PropTypes.bool,
    title: PropTypes.string,
};

export default LoadBalancerHeaderContent;
