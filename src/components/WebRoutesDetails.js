import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import ButtonBack from '../general/buttonBack';
import './loadBalancer.scss';
import { useParams, Redirect, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Loader, Grid, Button, Header } from 'semantic-ui-react';
import { webRoutesPath, editroutePath } from '../constants/routes';
import { deleteWebRouteAction, fetchWebRoute, updateWebRouteReset, fetchCertificate } from '../AppActions';
import DeleteModal from './DeleteModal';
import { withRouter } from 'react-router-dom';

const WebRoutesDetails = ({ t, history }) => {
    const { menuGroup,  id } = useParams();
    const route = useSelector((state) => state.BalancerStore.traefikRoute).route;
    const traefikRouteStatus = useSelector((state) => state.BalancerStore.traefikRouteStatus);
    const traefikRouteDeleteStatus = useSelector((state) => state.BalancerStore.traefikRouteDeleteStatus);
    const certificate = useSelector((state) => state.BalancerStore.certificate);
    const dispatch = useDispatch();
    const [selectedElement, setSelectedElement] = useState(null);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

    window.goToRootRoute = () => history.push('/load_balancer');

    useEffect(() => {
        dispatch(fetchWebRoute(id));
        dispatch(updateWebRouteReset());
    }, [dispatch, id]);

    useEffect(() => {
        traefikRouteStatus === 'fulfilled' && route.certificate_id !== null && dispatch(fetchCertificate(route?.certificate_id));
    }, [dispatch, traefikRouteStatus]);

    const openDeleteModal = (isOpen = true) => {
        setSelectedElement(route);
        setIsOpenDeleteModal(isOpen);
    };

    const deleteRoute = (id) => {dispatch(deleteWebRouteAction(id)); setSelectedElement(null);};

    function timeDifference(current, previous) {
        const msPerMinute = 60 * 1000;
        const msPerHour = msPerMinute * 60;
        const msPerDay = msPerHour * 24;
        const msPerMonth = msPerDay * 30;
        const msPerYear = msPerDay * 365;

        let elapsed = current - previous;

        if (elapsed < msPerMinute) {
            return `${Math.round(elapsed / 1000)} ${t('seconds')}`;
        }
        else if (elapsed < msPerHour) {
            return `${Math.round(elapsed / msPerMinute)} ${t('minutes')}`;
        }
        else if (elapsed < msPerDay) {
            return `${Math.round(elapsed / msPerHour)} ${t('hours')}`;
        }
        else if (elapsed < msPerMonth) {
            return  `${Math.round(elapsed / msPerDay)} ${t('days')}`;
        }
        else if (elapsed < msPerYear) {
            return  `${Math.round(elapsed / msPerMonth)} ${t('month')}`;
        }
        else {
            return `${Math.round(elapsed / msPerYear)} ${t('years')}`;
        }
    }

    const protocol = (route?.insecure === 'None' && route?.tls_termination === '') ? 'http://' : 'https://';

    if (traefikRouteDeleteStatus === 'fulfilled') {
        return <Redirect to={webRoutesPath(menuGroup)} />;
    }

    return <>
        <ButtonBack back={t('back')} path={webRoutesPath(menuGroup)} />
        {traefikRouteStatus !== 'fulfilled' || !Object.keys(route).length
            ? <Loader active inline="centered"/>
            :
            <Grid className='detailsContainer'>
                <div className='webRoutesDetailsHeader'>
                    <span>
                        <Header>{route.name}</Header>
                        <p className='created'>{t('threeYears',
                            { time: timeDifference(new Date().getTime(), new Date(route.created_at).getTime()) })}</p>
                    </span>
                    <span>
                        <Link to={editroutePath(menuGroup, id)}>
                            <Button basic color='black' size='small'>{t('edit')}</Button>
                        </Link>
                        <Button color='red' size='small' onClick={openDeleteModal}>{t('delete')}</Button>
                    </span>
                </div>
                <Grid.Row style={{ padding: '0' }}>
                    <Grid.Column>
                        <Header style={{ margin: '0px' }}><a href={`${protocol}${route.hostname}`} target='blank'>{route.hostname}</a></Header>
                    </Grid.Column>
                </Grid.Row >

                <Header as='h3'>{t('details')}:</Header>
                <Grid.Row>
                    <Grid.Column as='h5' width={3}>{t('path')}:</Grid.Column>
                    <Grid.Column width={4}>{route.path === '' ? t('none') : route.path}</Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column as='h5' width={3}>{t('service')}:</Grid.Column>
                    <Grid.Column width={4}>
                        {route.services.length > 0 ? route.services.map(el => el.name).join(', ') : t('none')}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column as='h5' width={3}>{t('targetPort')}:</Grid.Column>
                    <Grid.Column width={4}>{route.target_port}</Grid.Column>
                </Grid.Row>

                <Header as='h3'>{t('tlcSetting')}</Header>
                {!route.tls_termination && <Grid.Row><Grid.Column >{t('tlsNotEnabled')}</Grid.Column></Grid.Row>}
                <Grid.Row>
                    <Grid.Column as='h5' width={4}>{t('tlsType')}:</Grid.Column>
                    <Grid.Column width={4}>{route.tls_termination ? route.tls_termination : t('none')}</Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column as='h5' width={4}>{t('insecureTraffic')}:</Grid.Column>
                    <Grid.Column width={4}>{route.insecure === '' ? t('none') : route.insecure}</Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column as='h5' width={4}>{t('certificate')}:</Grid.Column>
                    <Grid.Column width={4}>{route.certificate_id === null ? t('none') : certificate.name}</Grid.Column>
                </Grid.Row>
            </Grid>}
        {selectedElement && <DeleteModal
            t={t}
            open={isOpenDeleteModal}
            setOpen={openDeleteModal}
            element={selectedElement}
            type = 'route'
            status = {traefikRouteDeleteStatus}
            callback={deleteRoute}
        />}

    </>;
};

WebRoutesDetails.propTypes = {
    t: PropTypes.func,
    history: PropTypes.history
};

export default withRouter(WebRoutesDetails);
