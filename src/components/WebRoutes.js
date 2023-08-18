import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WebRoutesList from './WebRoutesList';
import { fetchWebRoutes, deleteWebRouteReset, updateWebRouteReset, fetchGateways } from '../AppActions';
import { PropTypes } from 'prop-types';
import { copyInfo } from '../utilities/copyInfo';
import { Grid, Header } from 'semantic-ui-react';
import LoadBalancerHeaderContent from './LoadBalancerHeaderContent';
import { withRouter } from 'react-router-dom';

const ContentPage = React.lazy(() => import('container/ContentPage'));

const WebRoutes = ({ t, history }) => {
    const routes = useSelector(state => state.BalancerStore.traefikRoutes);
    const routesFetchStatus = useSelector(state => state.BalancerStore.traefikRoutesStatus);
    const user = useSelector(state => state.host.user);
    const vendor = useSelector(state => state.host.vendor);

    const dispatch = useDispatch();

    window.goToRootRoute = () => history.push('/load_balancer');

    useEffect(() => {
        dispatch(fetchWebRoutes());
        dispatch(deleteWebRouteReset());
        dispatch(updateWebRouteReset());
        dispatch(fetchGateways());
    }, [dispatch, user]);

    const getPublicHostname = (user) => {
        return ((user?.location === 'xby') || (user?.location === 'zby')) ? `${user.account}.alb.${user.location}.scdc.io` : `${user.account}.alb.${user.location}.${vendor}.io`
    } 
    
    const isNoData = routes.length < 1;

    return <>
        { isNoData && (
            <Grid style={{ padding: '0 16px 20px' }}>
                <Grid.Row className="content-page__header_traefik">
                    <Header as='h4' className='webRoutesHeader' content={t('loadBalancer')} />
                </Grid.Row>
                <Grid.Row style={{ padding: '0' }}>
                    <div className='loadBalancerDescription' style={{ margin: '0px' }}>
                        <p>{t('traefikDescriptionOne')}</p>
                        <div className='publicHostname'>
                            <span>{t('publicHostname')}</span>
                            <span>{getPublicHostname(user)}{copyInfo(getPublicHostname(user))}</span>
                        </div>
                        <p>{t('traefikDescriptionTwo')}</p>
                    </div>
                </Grid.Row>
            </Grid>
        )}
        <ContentPage t={t} statuses={[routesFetchStatus]} pageData={routes} title={'loadBalancer'}
            componentDataList={WebRoutesList} noContentMessage={'noWebRoutes'}>
            <LoadBalancerHeaderContent t={t} isNoData={isNoData} isWebRoutes title={'loadBalancer'}/>
        </ContentPage>
    </>;
};

WebRoutes.propTypes = {
    t: PropTypes.func,
    history: PropTypes.any
};

export default withRouter(WebRoutes);
