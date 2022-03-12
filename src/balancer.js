import React, { useEffect } from 'react';
import LoadBalancerOverview from './components/overview';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import Lang from './Lang';
import { BalancerStore } from './AppReducer';
// import './App.scss';

const Balancer = ({ store }) => {
  useEffect(() => {
    store.injectReducer('BalancerStore', BalancerStore);
  }, []);

  return <Provider store={store}>
    <Router>
      <Lang>
        <LoadBalancerOverview />
      </Lang>
    </Router>
  </Provider>;
};

export default Balancer;
