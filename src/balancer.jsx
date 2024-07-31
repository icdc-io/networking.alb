import React, { useEffect, useState } from "react";
import LoadBalancerOverview from "./components/overview";
import { Provider } from "react-redux";
import { BalancerStore } from "./AppReducer";
import { Loader, Segment } from "semantic-ui-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import TabsLayout from "./components/tabsLayout";
import { certificatesPath, webRoutesPath } from "./constants/routes";
import "./App.scss";

const Balancer = ({ store }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { t } = useTranslation();

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

  useEffect(() => {
    store.injectReducer("BalancerStore", BalancerStore);
    setIsLoaded(true);
  }, []);

  return (
    <Provider store={store}>
      <TabsLayout menuItems={menuItems} />
      <Segment attached="bottom">
        {isLoaded ? (
          <LoadBalancerOverview />
        ) : (
          <Loader active inline="centered" />
        )}
      </Segment>
    </Provider>
  );
};

Balancer.propTypes = {
  store: PropTypes.object,
};

export default Balancer;
