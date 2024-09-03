import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Loader } from "semantic-ui-react";
import { BalancerStore } from "./AppReducer";
import LoadBalancerOverview from "./components/overview";
import "./App.scss";

const Balancer = ({ store }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    store.injectReducer("BalancerStore", BalancerStore);
    setIsLoaded(true);
  }, []);

  return isLoaded ? (
    <LoadBalancerOverview />
  ) : (
    <Loader active inline="centered" />
  );
};

Balancer.propTypes = {
  store: PropTypes.object,
};

export default Balancer;
