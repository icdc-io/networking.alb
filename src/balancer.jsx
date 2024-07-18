import React, { useEffect, useState } from "react";
import LoadBalancerOverview from "./components/overview";
import { BrowserRouter } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { BalancerStore } from "./AppReducer";
import { Loader } from "semantic-ui-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import "./App.scss";

const Overview = () => {
  const { i18n } = useTranslation();
  const lang = useSelector((state) => state.host.lang);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return (
    <BrowserRouter basename={window.location.pathname.split("/")[1]}>
      <LoadBalancerOverview />
    </BrowserRouter>
  );
};

const Balancer = ({ store }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    store.injectReducer("BalancerStore", BalancerStore);
    setIsLoaded(true);
  }, []);

  return (
    <Provider store={store}>
      {isLoaded ? <Overview /> : <Loader active inline="centered" />}
    </Provider>
  );
};

Balancer.propTypes = {
  store: PropTypes.object,
};

export default Balancer;
