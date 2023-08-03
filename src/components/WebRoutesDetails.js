import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import ButtonBack from '../general/buttonBack';
import './loadBalancer.scss';
import { useParams, Redirect, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Loader, Grid, Button, Header } from 'semantic-ui-react';
import { webRoutesPath, editroutePath } from '../constants/routes';
import { fetchWebRoute, updateWebRouteReset, fetchCertificate } from '../AppActions';
import DeleteModal from './DeleteModal';
import { withRouter } from 'react-router-dom';
import WebRoute from '../static/images/webroutes.svg';
const ApiButton = React.lazy(() => import('container/ApiButton'));
const NoContent = React.lazy(() => import('container/NoContent'));

const WebRoutesDetails = ({ t, history }) => {
    const { menuGroup, id } = useParams();
    const route = useSelector((state) => state.BalancerStore.traefikRoute).route;
    const traefikRouteStatus = useSelector((state) => state.BalancerStore.traefikRouteStatus);
    const traefikRouteDeleteStatus = useSelector((state) => state.BalancerStore.traefikRouteDeleteStatus);
    const certificate = useSelector((state) => state.BalancerStore.certificate);
    const user = useSelector(state => state.host.user);
    const baseUrls = useSelector(state => state.host.baseUrls);

    const dispatch = useDispatch();

    window.goToRootRoute = () => history.push('/load_balancer');

    useEffect(() => {
        dispatch(fetchWebRoute(id));
        dispatch(updateWebRouteReset());
    }, [dispatch, id, user]);

    useEffect(() => {
        traefikRouteStatus === 'fulfilled' && route.certificate_id !== null && dispatch(fetchCertificate(route?.certificate_id));
    }, [dispatch, traefikRouteStatus]);

    const protocol = (!route?.insecure && !route?.tls_termination) ? 'http://' : 'https://';

    const computeLink = user.location == 'dby' ? `https://compute-dev.zby.icdc.io` : `https://compute.${user.location}.icdc.io`;

    if (traefikRouteDeleteStatus === 'fulfilled') {
        return <Redirect to={webRoutesPath(menuGroup)} />;
    }
    
    if (traefikRouteStatus === 'rejected') {
        return <NoContent icon='desktop' textMessage={t('wrong')} />
    } else 
    return <>
        <ButtonBack back={t('back')} path={webRoutesPath(menuGroup)} />
        {traefikRouteStatus !== 'fulfilled' || !Object.keys(route).length
            ? <Loader active inline="centered" />
            :
            <Grid className='details-container'>
                <div className='web-routes-details-header'>
                    <Header><img src={WebRoute} width='41' />{route.name}</Header>
                    <div className='create-route-buttons'>
                        <Link to={editroutePath(menuGroup, id)}>
                            <Button basic color='black' size='medium'>{t('edit')}</Button>
                        </Link>
                        <ApiButton element='routesId' user={user} locationUrl={baseUrls[user.location]} />
                    </div>
                </div>
                <Header as='h3' style={{ marginTop: '12px' }}>{t('details')}</Header>
                <Grid.Row className='web-routes-details-row-style'>
                    <Grid.Column width={4}>{t('hostname')}</Grid.Column>
                    <Grid.Column width={4}>
                        <Header style={{ margin: '0px' }}><a href={`${protocol}${route.hostname}`} target='blank'>{route.hostname}</a></Header>
                    </Grid.Column>
                </Grid.Row >
                <Grid.Row className='web-routes-details-row-style'>
                    <Grid.Column width={4}>{t('balancer')}</Grid.Column>
                    <Grid.Column as='h5' width={4}>{route.cloud_gateway_id === '' ? t('none') : `${route.cloud_gateway.cloudgw_instance} (${route.cloud_gateway.name})`}</Grid.Column>
                </Grid.Row >
                <Grid.Row className='web-routes-details-row-style'>
                    <Grid.Column width={4}>{t('path')}</Grid.Column>
                    <Grid.Column as='h5' width={4}>{route.path === '' ? t('none') : route.path}</Grid.Column>
                </Grid.Row>
                <Grid.Row className='web-routes-details-row-style'>
                    <Grid.Column width={4}>{t('service')}</Grid.Column>
                    <Grid.Column as='section' width={8}>
                        {route.services.length > 0 ? route.services.map((el, i) => 
                                <a 
                                    key={i} 
                                    href={`${computeLink}/ui/service/services/${el.ext_id}`}
                                    target='_blank'>
                                        {`${el.name} (${el.ext_id})${i != route.services.length-1 ? ',' : ''}`}
                                </a>) 
                            : t('none')}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className='web-routes-details-row-style'>
                    <Grid.Column width={4}>{t('targetPort')}</Grid.Column>
                    <Grid.Column as='h5' width={4}>{route.target_port}</Grid.Column>
                </Grid.Row>

                {route.healthcheck_enabled && <><Header as='h3'>{t('healthCheck')}</Header>
                    <Grid.Row className='web-routes-details-heathcheck-row-style'>
                        <Grid.Column width={4}>{t('hostname')}</Grid.Column>
                        <Grid.Column width={4}>
                            {route?.healthcheck?.hostname ?
                                <Header style={{ margin: '0px' }}><a href={`${protocol}${route.healthcheck.hostname}`} target='blank'>{route.healthcheck.hostname}</a></Header>
                                : t('none')}
                        </Grid.Column>
                    </Grid.Row >
                    <Grid.Row className='web-routes-details-heathcheck-row-style' >
                        <Grid.Column width={4}>{t('path')}</Grid.Column>
                        <Grid.Column as='h5' width={4}>{route?.healthcheck?.path ? route.healthcheck.path : t('none')}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row className='web-routes-details-heathcheck-row-style'>
                        <Grid.Column width={4}>{t('scheme')}</Grid.Column>
                        <Grid.Column as='h5' width={4}>{route?.healthcheck?.scheme ? route.healthcheck.scheme : t('none')}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row className='web-routes-details-heathcheck-row-style'>
                        <Grid.Column width={4}>{t('port')}</Grid.Column>
                        <Grid.Column as='h5' width={4}>{route?.healthcheck?.port ? route.healthcheck.port : t('none')}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row className='web-routes-details-heathcheck-row-style'>
                        <Grid.Column width={4}>{t('intervalSec')}</Grid.Column>
                        <Grid.Column as='h5' width={4}>{route?.healthcheck?.interval ? route.healthcheck.interval : t('none')}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row className='web-routes-details-heathcheck-row-style'>
                        <Grid.Column width={4}>{t('timeout')}</Grid.Column>
                        <Grid.Column as='h5' width={4}>{route?.healthcheck?.timeout ? route.healthcheck.timeout : t('none')}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row className='web-routes-details-heathcheck-row-style'>
                        <Grid.Column width={4}><h5>{t('headers')}:</h5></Grid.Column>
                    </Grid.Row>
                    <Grid.Row className='web-routes-details-heathcheck-row-style'>
                        <Grid.Column width={4}>x-icdc-account</Grid.Column>
                        <Grid.Column as='h5' width={4}>{route?.healthcheck?.headers ? route?.healthcheck?.headers['x-icdc-account'] : t('none')}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row className='web-routes-details-heathcheck-row-style'>
                        <Grid.Column width={4}>x-icdc-role</Grid.Column>
                        <Grid.Column as='h5' width={4}>{route?.healthcheck?.headers ? route?.healthcheck?.headers['x-icdc-role'] : t('none')}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row className='web-routes-details-heathcheck-row-style'>
                        <Grid.Column width={4}>{t('followRedirects')}</Grid.Column>
                        <Grid.Column as='h5' width={4}>{route?.healthcheck?.follow_redirects ? t('trueCheck') : t('falseCheck')}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row className='web-routes-details-heathcheck-row-style'>
                        <Grid.Column width={4}>{t('method')}</Grid.Column>
                        <Grid.Column as='h5' width={4}>{route?.healthcheck?.method ? route.healthcheck.method : t('none')}</Grid.Column>
                    </Grid.Row>
                </>
                }

                <Header as='h3'>{t('tlcSetting')}</Header>
                {!route.tls_termination && <Grid.Row><Grid.Column >{t('tlsNotEnabled')}</Grid.Column></Grid.Row>}
                <Grid.Row className='web-routes-details-row-style'>
                    <Grid.Column width={4}>{t('tlsType')}:</Grid.Column>
                    <Grid.Column as='h5' width={4}>{route.tls_termination ? route.tls_termination : t('none')}</Grid.Column>
                </Grid.Row>
                <Grid.Row className='web-routes-details-row-style'>
                    <Grid.Column width={4}>{t('insecureTraffic')}:</Grid.Column>
                    <Grid.Column as='h5' width={4}>{route.insecure === null ? t('none') : route.insecure}</Grid.Column>
                </Grid.Row>
                <Grid.Row className='web-routes-details-row-style'>
                    <Grid.Column width={4}>{t('certificate')}:</Grid.Column>
                    <Grid.Column as='h5' width={4}>{route.certificate_id === null ? t('none') : certificate.name}</Grid.Column>
                </Grid.Row>

                <Grid.Row verticalAlign='middle' className='network-delete'>
                    <div>
                        <b>{`${t('delete')} ${t('webRoutes')}`.toUpperCase()}</b>
                        <p>{t('cannotBeUndone')}</p>
                    </div>
                    <div className='delete-webroute-action'><DeleteModal type='webRoutes' button instance={route} t={t}/></div>
                </Grid.Row>
            </Grid>}
    </>;
};

WebRoutesDetails.propTypes = {
    t: PropTypes.func,
    history: PropTypes.object
};

export default withRouter(WebRoutesDetails);
