import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CertificatesList from './CertificatesList';
import { deleteCertificateReset, fetchCertificates, updateCertificateReset } from '../AppActions';
import LoadBalancerHeaderContent from './LoadBalancerHeaderContent';
import { withRouter } from 'react-router-dom';
import { PropTypes } from 'prop-types';

const ContentPage = React.lazy(() => import('container/ContentPage'));

const Certificates = ({ t, history }) => {
    const certificates = useSelector(state => state.BalancerStore.certificates);
    const certificatesFetchStatus = useSelector(state => state.BalancerStore.certificatesStatus);
    const user = useSelector(state => state.host.user);

    window.goToRootRoute = () => history.push('/load_balancer');

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchCertificates());
        dispatch(deleteCertificateReset());
        dispatch(updateCertificateReset());
    }, [dispatch, user]);

    return (
        <ContentPage t={t} statuses={[certificatesFetchStatus]} pageData={certificates} title={'certificates'}
            componentDataList={CertificatesList} noContentMessage={'noCertificates'} traefik>
            <LoadBalancerHeaderContent t={t} isNoData={certificates.length < 1} title={'certificates'}/>
        </ContentPage>
    );
};

Certificates.propTypes = {
    t: PropTypes.func,
    history: PropTypes.any
};

export default withRouter(Certificates);

