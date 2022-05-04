import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Grid, Header, Loader, Table } from 'semantic-ui-react';
import './loadBalancer.scss';
import ButtonBack from '../general/buttonBack';
import { fetchCertificate, deleteCertificateAction, updateCertificateReset } from '../AppActions';
import { certificatesPath, editCertificatePath } from '../constants/routes';
import DeleteModal from './DeleteModal';
import { copyInfo } from '../utilities/copyInfo';
import { Link, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import CertificateImg from '../static/images/certificate.svg';

const CertificateDetails = ({ t }) => {
    const { menuGroup, id } = useParams();
    const certificate = useSelector((state) => state.BalancerStore.certificate);
    const certificateStatus = useSelector((state) => state.BalancerStore.certificateStatus);
    const certificateDeleteStatus = useSelector((state) => state.BalancerStore.certificateDeleteStatus);
    const [selectedElement, setSelectedElement] = useState(null);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const user = useSelector(state => state.host.user);
    const ApiButton = React.lazy(() => import('container/ApiButton'));

    const dispatch = useDispatch();

    window.goToRootRoute = () => history.push('/load_balancer');

    useEffect(() => {
        dispatch(fetchCertificate(id));
        dispatch(updateCertificateReset());
    }, [dispatch, id]);

    const openDeleteModal = (isOpen = true) => {
        setSelectedElement(certificate);
        setIsOpenDeleteModal(isOpen);
    };

    // const deleteCertificate = (id) => { dispatch(deleteCertificateAction(id)); };

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

    const cerificateList = certificatesData.map((e, index) => e.value ?
        <Grid.Row className='cert-details-row' key={index}>
            <div className='api-dialog-snippet-wrapper display-certificate'>
                <CodeSnippet
                    title={messages[e.title]}
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
                                user={user} />
                            {/* <Button color='red' size='small' onClick={openDeleteModal}>{t('delete')}</Button> */}
                        </div>
                    </span>
                </div>
                {cerificateList}
                <Grid.Row verticalAlign='middle' className='network-delete'>
                    <Grid.Column width={15}>
                        <b>{`${t('delete')} ${t('webRoutes')}`.toUpperCase()}</b>
                        <p>{t('cannotBeUndone')}</p>
                    </Grid.Column>
                    <Grid.Column className='delete-webroute-action'><Button size='small' className='delete-route-button' onClick={openDeleteModal}>{t('delete')}</Button></Grid.Column>
                </Grid.Row>
            </Grid>
                {selectedElement && <DeleteModal
                    t={t}
                    open={isOpenDeleteModal}
                    setOpen={openDeleteModal}
                    element={selectedElement}
                    type='certificate'
                    callback={deleteCertificate}
                />}
            </>}
    </section>);
};

CertificateDetails.propTypes = {
    t: PropTypes.func,
    history: PropTypes.any
};
export default withRouter(CertificateDetails);
