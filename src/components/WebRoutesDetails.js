import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { PropTypes } from 'prop-types';
import ButtonBack from '../general/buttonBack';
import './loadBalancer.scss';
import { useParams, Redirect, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Loader, Grid, Button, Header } from 'semantic-ui-react';
import messages from '../Messages';
import { webRoutesPath, editroutePath } from '../constants/routes';
import { deleteWebRouteAction, fetchWebRoute, updateWebRouteReset, fetchCertificate } from '../AppActions';
import DeleteModal from './DeleteModal';
import { withRouter } from 'react-router-dom';

const WebRoutesDetails = ({ intl, history }) => {
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
            return `${Math.round(elapsed / 1000)} ${intl.formatMessage(messages.seconds)}`;
        }
        else if (elapsed < msPerHour) {
            return `${Math.round(elapsed / msPerMinute)} ${intl.formatMessage(messages.minutes)}`;
        }
        else if (elapsed < msPerDay) {
            return `${Math.round(elapsed / msPerHour)} ${intl.formatMessage(messages.hours)}`;
        }
        else if (elapsed < msPerMonth) {
            return  `${Math.round(elapsed / msPerDay)} ${intl.formatMessage(messages.days)}`;
        }
        else if (elapsed < msPerYear) {
            return  `${Math.round(elapsed / msPerMonth)} ${intl.formatMessage(messages.month)}`;
        }
        else {
            return `${Math.round(elapsed / msPerYear)} ${intl.formatMessage(messages.years)}`;
        }
    }

    const protocol = (route?.insecure === 'None' && route?.tls_termination === '') ? 'http://' : 'https://';

    if (traefikRouteDeleteStatus === 'fulfilled') {
        return <Redirect to={webRoutesPath(menuGroup)} />;
    }

    return <>
        <ButtonBack path={webRoutesPath(menuGroup)} />
        {traefikRouteStatus !== 'fulfilled' ||  !Object.keys(route).length
            ? <Loader active inline="centered"/>
            :
            <Grid className='detailsContainer'>
                <div className='webRoutesDetailsHeader'>
                    <span>
                        <Header>{route.name}</Header>
                        <p className='created'>{intl.formatMessage(messages.threeYears,
                            { time: timeDifference(new Date().getTime(), new Date(route.created_at).getTime()) })}</p>
                    </span>
                    <span>
                        <Link to={editroutePath(menuGroup, id)}>
                            <Button basic color='black' size='small'>{intl.formatMessage(messages.edit)}</Button>
                        </Link>
                        <Button color='red' size='small' onClick={openDeleteModal}>{intl.formatMessage(messages.delete)}</Button>
                    </span>
                </div>
                <Grid.Row style={{ padding: '0' }}>
                    <Grid.Column>
                        <Header style={{ margin: '0px' }}><a href={`${protocol}${route.hostname}`} target='blank'>{route.hostname}</a></Header>
                    </Grid.Column>
                </Grid.Row >

                <Header as='h3'>{intl.formatMessage(messages.details)}:</Header>
                <Grid.Row>
                    <Grid.Column as='h5' width={3}>{intl.formatMessage(messages.path)}:</Grid.Column>
                    <Grid.Column width={4}>{route.path === '' ? intl.formatMessage(messages.none) : route.path}</Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column as='h5' width={3}>{intl.formatMessage(messages.service)}:</Grid.Column>
                    <Grid.Column width={4}>
                        {route.services.length > 0 ? route.services.map(el => el.name).join(', ') : intl.formatMessage(messages.none)}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column as='h5' width={3}>{intl.formatMessage(messages.targetPort)}:</Grid.Column>
                    <Grid.Column width={4}>{route.target_port}</Grid.Column>
                </Grid.Row>

                <Header as='h3'>{intl.formatMessage(messages.tlcSetting)}</Header>
                {!route.tls_termination && <Grid.Row><Grid.Column >{intl.formatMessage(messages.tlsNotEnabled)}</Grid.Column></Grid.Row>}
                <Grid.Row>
                    <Grid.Column as='h5' width={4}>{intl.formatMessage(messages.tlsType)}:</Grid.Column>
                    <Grid.Column width={4}>{route.tls_termination ? route.tls_termination : intl.formatMessage(messages.none)}</Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column as='h5' width={4}>{intl.formatMessage(messages.insecureTraffic)}:</Grid.Column>
                    <Grid.Column width={4}>{route.insecure === '' ? intl.formatMessage(messages.none) : route.insecure}</Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column as='h5' width={4}>{intl.formatMessage(messages.certificate)}:</Grid.Column>
                    <Grid.Column width={4}>{route.certificate_id === null ? intl.formatMessage(messages.none) : certificate.name}</Grid.Column>
                </Grid.Row>
            </Grid>}
        {selectedElement && <DeleteModal
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
    intl: PropTypes.any,
    history: PropTypes.history
};

export default injectIntl(withRouter(WebRoutesDetails));
