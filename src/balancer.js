import React, { useEffect } from 'react';
import LoadBalancerOverview from './components/overview';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { BalancerStore } from './AppReducer';
import './App.scss';

const Balancer = ({ t, store }) => {
  useEffect(() => {
    store.injectReducer('BalancerStore', BalancerStore);
  }, []);

  return <Provider store={store}>
    <Router>
      <LoadBalancerOverview t={t} />
    </Router>
  </Provider>;
};

export default Balancer;
