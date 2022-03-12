import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import messages from '../Messages';
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

const CertificateDetails = ({ intl }) => {
    const { menuGroup,  id } = useParams();
    const certificate = useSelector((state) => state.BalancerStore.certificate);
    const certificateStatus = useSelector((state) => state.BalancerStore.certificateStatus);
    const certificateDeleteStatus = useSelector((state) => state.BalancerStore.certificateDeleteStatus);
    const [selectedElement, setSelectedElement] = useState(null);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

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

    const deleteCertificate = (id) => {dispatch(deleteCertificateAction(id));};

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
        <Grid.Row className='certDetailsRow' key={index}>
            <Table style={{ wordBreak: 'break-all' }}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell textAlign='left'>{intl.formatMessage(messages[e.title])}</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>{copyInfo(e.value)}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell className='keyOfCertificate'>
                            {(e.value && e.value.length > 210) ? `${e.value.substr(0, 210)}...` : e.value}
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </Grid.Row> :
        <>
            <Grid.Row className='certDetailsRow'>
                <Header as="h3">{intl.formatMessage(messages[e.title])}</Header>
            </Grid.Row>
            <Grid.Row className='certDetailsRow'>
                <Header as="h5" style={{ width: '700px' }}>{intl.formatMessage(messages.none)}</Header>
            </Grid.Row>
        </>
    );

    return (<section>
        <ButtonBack path={certificatesPath(menuGroup)} />
        {certificateStatus !== 'fulfilled' || !Object.keys(certificate).length
            ? <Loader active inline="centered"/>
            : <><Grid className='certificateDetails'>
                <div className='certificateDetailsHeader'>
                    <Header>{certificate.name}</Header>
                    <span>
                        <Link to={editCertificatePath(menuGroup, id)}>
                            <Button basic color='black' size='small'>{intl.formatMessage(messages.edit)}</Button>
                        </Link>
                        <Button color='red' size='small' onClick={openDeleteModal}>{intl.formatMessage(messages.delete)}</Button>
                    </span>
                </div>
                {cerificateList}
            </Grid>
            {selectedElement && <DeleteModal
                open={isOpenDeleteModal}
                setOpen={openDeleteModal}
                element={selectedElement}
                type = 'certificate'
                callback={deleteCertificate}
            />}
            </>}
    </section>);
};

CertificateDetails.propTypes = {
    intl: PropTypes.any,
    history: PropTypes.any
};
export default injectIntl(withRouter(CertificateDetails));
