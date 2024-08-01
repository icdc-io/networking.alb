import React, { useEffect, useState } from "react";
import LoadBalancerOverview from "./components/overview";
import { Provider } from "react-redux";
import { BalancerStore } from "./AppReducer";
import { Loader } from "semantic-ui-react";
import PropTypes from "prop-types";
import "./App.scss";

const Balancer = ({ store }) => {
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    store.injectReducer("BalancerStore", BalancerStore);
    setIsLoaded(true);
  }, []);

  return (
    <Provider store={store}>
      {isLoaded ? (
        <LoadBalancerOverview />
      ) : (
        <Loader active inline="centered" />
      )}
    </Provider>
  );
};

Balancer.propTypes = {
  store: PropTypes.object,
};

export default Balancer;
