import React, { useEffect } from 'react';
import ContentPage from '../general/contentPage';
import { useSelector, useDispatch } from 'react-redux';
import messages from '../Messages';
import CertificatesList from './CertificatesList';
import { deleteCertificateReset, fetchCertificates, updateCertificateReset } from '../AppActions';
import LoadBalancerHeaderContent from './LoadBalancerHeaderContent';
import { withRouter } from 'react-router-dom';
import { PropTypes } from 'prop-types';

const Certificates = ({ history }) => {
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
        <ContentPage status={certificatesFetchStatus} pageData={certificates} title={messages.certificates}
            componentDataList={CertificatesList} noContentMessage={messages.noCertificates} traefik>
            <LoadBalancerHeaderContent isNoData={certificates.length < 1} title={messages.certificates}/>
        </ContentPage>
    );
};

Certificates.propTypes = {
    history: PropTypes.any
};

export default withRouter(Certificates);

