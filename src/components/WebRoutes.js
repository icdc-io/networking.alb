import React, { useEffect } from 'react';
import ContentPage from '../general/contentPage';
import { useDispatch, useSelector } from 'react-redux';
import messages from '../Messages';
import WebRoutesList from './WebRoutesList';
import { fetchWebRoutes, deleteWebRouteReset, updateWebRouteReset } from '../AppActions';
import { injectIntl } from 'react-intl';
import { PropTypes } from 'prop-types';
import { copyInfo } from '../utilities/copyInfo';
import { Grid, Header } from 'semantic-ui-react';
import LoadBalancerHeaderContent from './LoadBalancerHeaderContent';
import { withRouter } from 'react-router-dom';

const WebRoutes = ({ intl, history }) => {
    const routes = useSelector(state => state.BalancerStore.traefikRoutes);
    const routesFetchStatus = useSelector(state => state.BalancerStore.traefikRoutesStatus);
    const user = useSelector(state => state.host.user);

    const dispatch = useDispatch();

    window.goToRootRoute = () => history.push('/load_balancer');

    useEffect(() => {
        dispatch(fetchWebRoutes());
        dispatch(deleteWebRouteReset());
        dispatch(updateWebRouteReset());
    }, [dispatch, user]);

    const publicHostname = `${user.account}.alb.${user.location}.icdc.io`;
    const isNoData = routes.length < 1;

    return <>
        { isNoData && (
            <Grid style={{ padding: '0 16px' }}>
                <Grid.Row className="content-page__header_traefik">
                    <Header as='h4' className='webRoutesHeader' content={intl.formatMessage(messages.loadBalancer)} />
                </Grid.Row>
                <Grid.Row style={{ padding: '0' }}>
                    <div className='loadBalancerDescription' style={{ margin: '0px' }}>
                        <p>{intl.formatMessage(messages.traefikDescriptionOne)}</p>
                        <div className='publicHostname'>
                            <span>{intl.formatMessage(messages.publicHostname)}</span>
                            <span>{publicHostname}{copyInfo(publicHostname)}</span>
                        </div>
                        <p>{intl.formatMessage(messages.traefikDescriptionTwo)}</p>
                    </div>
                </Grid.Row>
            </Grid>
        )}
        <ContentPage status={routesFetchStatus} pageData={routes} title={messages.loadBalancer}
            componentDataList={WebRoutesList} noContentMessage={messages.noWebRoutes}>
            <LoadBalancerHeaderContent isNoData={isNoData} isWebRoutes title={messages.loadBalancer}/>
        </ContentPage>
    </>;
};

WebRoutes.propTypes = {
    intl: PropTypes.any,
    history: PropTypes.any
};

export default injectIntl(withRouter(WebRoutes));
