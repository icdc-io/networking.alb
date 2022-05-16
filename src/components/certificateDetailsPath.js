import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Grid, Header, Loader } from 'semantic-ui-react';
import './loadBalancer.scss';
import ButtonBack from '../general/buttonBack';
import { fetchCertificate, updateCertificateReset } from '../AppActions';
import { certificatesPath, editCertificatePath } from '../constants/routes';
import DeleteModal from './DeleteModal';
import { Link, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import CertificateImg from '../static/images/certificate.svg';
const ApiButton = React.lazy(() => import('container/ApiButton'));

const CertificateDetails = ({ t }) => {
    const { menuGroup, id } = useParams();
    const certificate = useSelector((state) => state.BalancerStore.certificate);
    const certificateStatus = useSelector((state) => state.BalancerStore.certificateStatus);
    const certificateDeleteStatus = useSelector((state) => state.BalancerStore.certificateDeleteStatus);
    const user = useSelector(state => state.host.user);
    const baseUrls = useSelector(state => state.host.baseUrls);
    
    const CodeSnippet = React.lazy(() => import('container/CodeSnippet'));
    
    const dispatch = useDispatch();

    window.goToRootRoute = () => history.push('/load_balancer');

    useEffect(() => {
        dispatch(fetchCertificate(id));
        dispatch(updateCertificateReset());
    }, [dispatch, id]);


    if (certificateDeleteStatus === 'fulfilled') {
        return <Redirect to={certificatesPath(menuGroup)} />;
    }

    const certificatesData = [
        {
            title: 'certificate',
            value: certificate.values?.cert
        },
        {
            title: 'key',
            value: certificate.values?.key
        },
        {
            title: 'caCertificate',
            value: certificate.values?.ca
        },
        {
            title: 'destinationCertificate',
            value: certificate.values?.dest_ca
        }
    ];

    const copy = value => navigator.clipboard.writeText(value);

    const cerificateList = certificatesData.map((e, index) => e.value ?
        <Grid.Row className='cert-details-row' key={index}>
            <div className='api-dialog-snippet-wrapper display-certificate'>
                <CodeSnippet
                    title={t(e.title)}
                    content={e.value}
                    copyFuncion={copy} />
            </div>
        </Grid.Row> :
        <Grid.Row className='cert-details-row-none' key={index}>
            <Grid.Row className='cert-details-row'>
                <Header as="h4">{t([e.title])}</Header>
            </Grid.Row>
            <Grid.Row className='cert-details-row'>
                <p>{t('none')}</p>
            </Grid.Row>
        </Grid.Row>
    );

    return (<section>
        <ButtonBack back={t('back')} path={certificatesPath(menuGroup)} />
        {certificateStatus !== 'fulfilled' || !Object.keys(certificate).length
            ? <Loader active inline="centered" />
            : <><Grid className='certificate-details'>
                <div className='certificate-details-header'>
                    <Header>
                        <img src={CertificateImg} width='35' />
                        {certificate.name}
                    </Header>
                    <span>
                        <div className='create-route-buttons'>
                            <Link to={editCertificatePath(menuGroup, id)}>
                                <Button basic color='black' size='small'>{t('edit')}</Button>
                            </Link>
                            <ApiButton element='certificate'
                                user={user}
                                locationUrl={baseUrls[user.location]}
                            />
                        </div>
                    </span>
                </div>
                {cerificateList}
                <Grid.Row verticalAlign='middle' className='network-delete'>
                    <div >
                        <b>{`${t('delete')} ${t('certificate')}`.toUpperCase()}</b>
                        <p>{t('cannotBeUndone')}</p>
                    </div>
                    <DeleteModal type='certificates' button instance={certificate} t={t} />
                </Grid.Row>
            </Grid>
            </>}
    </section>);
};

CertificateDetails.propTypes = {
    t: PropTypes.func,
    history: PropTypes.any
};
export default withRouter(CertificateDetails);
