import React, { useEffect, useRef, useState } from 'react';
import { injectIntl } from 'react-intl';
import { PropTypes } from 'prop-types';
import { Button, Grid, Header, Input, TextArea } from 'semantic-ui-react';
import messages from '../Messages';
import './loadBalancer.scss';
import { useParams, Redirect } from 'react-router-dom';
import { certificateDetailsPath, certificatesPath } from '../constants/routes';
import ButtonBack from '../general/buttonBack';
import CancelChangesModal from './CancelChangesModal';
import { useSelector, useDispatch } from 'react-redux';
import { createCertificate, updateCertificate } from '../AppActions';
import { withRouter } from 'react-router-dom';

const CreateEditCertificate = ({ intl, history }) => {
    const { menuGroup, id } = useParams();
    const user = useSelector(state => state.host.user);
    const certificate = useSelector((state) => state.BalancerStore.certificate);
    const certificateUpdateStatus = useSelector((state) => state.BalancerStore.certificateUpdateStatus);

    const dispatch = useDispatch();
    /* eslint camelcase: 0 */
    const initialState = {
        name: '',
        cert: '',
        key: '',
        ca: '',
        dest_ca: '',
        owner: ''
    };
    const [commonName, setCommonName] = useState('');
    const [pathCertificate, setPathCertificate] = useState('');
    const [textCertificate, setTextCertificate] = useState('');
    const [pathPrivateKey, setPathPrivateKey] = useState('');
    const [textPrivateKey, setTextPrivateKey] = useState('');
    const [pathCaCertificate, setPathCaCertificate] = useState('');
    const [textCaCertificate, setTextCaCertificate] = useState('');
    const [pathDCaCertificate, setPathDCaCertificate] = useState('');
    const [textDCaCertificate, setTextDCaCertificate] = useState('');
    const [isOpenCancelChangesModal, setIsOpenCancelChangesModal] = useState(false);
    const [requestBody, setRequestBody] = useState(initialState);

    let refCertificate = useRef(null);
    let refPrivateKey = useRef(null);
    let refCaCertificate = useRef(null);
    let refDCaCertificate = useRef(null);

    window.goToRootRoute = () => history.push('/load_balancer');

    useEffect(() => {
        !id && setRequestBody({ ...requestBody, owner: user.email });
    }, [user]);

    useEffect(() => {
        setRequestBody({ ...requestBody,
            name: commonName,
            cert: textCertificate,
            key: textPrivateKey,
            ca: textCaCertificate,
            dest_ca: textDCaCertificate });
    }, [commonName, textCertificate, textPrivateKey, textCaCertificate, textDCaCertificate]);

    useEffect(()=>{
        if (id) {
            setCommonName(certificate.name);
            setTextCertificate(certificate.values.cert);
            setTextCaCertificate(certificate.values.ca);
            setTextPrivateKey(certificate.values.key);
            setTextDCaCertificate(certificate.values.dest_ca);
            setPathCertificate(certificate.cert_path);
            setPathCaCertificate(certificate.ca_path);
            setPathDCaCertificate(certificate.dest_ca_path);
            setPathPrivateKey(certificate.key_path);
            setRequestBody({ ...requestBody, owner: certificate.owner });
        }
    }, [id]);

    const openCancelChangesModal = (isOpen = true) => {
        setIsOpenCancelChangesModal(isOpen);
    };

    //upload files using button
    const callbackField = (e, setPath, setText) => {
        setPath(e.currentTarget.value);
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.readAsText(file);
        reader.onloadend = () => {
            setText(reader.result);
        };
    };

    const onClickCertificate = () => {refCertificate.current.click();};

    const onClickPrivateKey = () => {refPrivateKey.current.click();};

    const onClickCaCertificate = () => {refCaCertificate.current.click();};

    const onClickDCaCertificate = () => {refDCaCertificate.current.click();};

    //Drag & Drop upload file
    const handleDragEnter = e => e.preventDefault();

    const handleDragLeave = e => e.preventDefault();

    const handleDragOver = e => e.preventDefault();

    const handleDrop = (e, setText) => {
        e.preventDefault();
        let dt = e.dataTransfer;
        let file = dt.files[0];
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = () => {
            setText(reader.result);
        };
    };

    //onChange callbacks
    const onChangeName = (e) => setCommonName(e.currentTarget.value);

    const onChangeCertificate = (e) => setPathCertificate(e.currentTarget.value);

    const onChangePrivateKey = (e) => setPathPrivateKey(e.currentTarget.value);

    const onChangeCaCertificate = (e) => setPathCaCertificate(e.currentTarget.value);

    const onChangeDCaCertificate = (e) => setPathDCaCertificate(e.currentTarget.value);

    const onChangeTextCertificate = (e) => setTextCertificate(e.currentTarget.value);

    const onChangeTextPrivateKey = (e) => setTextPrivateKey(e.currentTarget.value);

    const onChangeTextCaCertificate = (e) => setTextCaCertificate(e.currentTarget.value);

    const onChangeTextDCaCertificate = (e) => setTextDCaCertificate(e.currentTarget.value);

    //edit & create callback's
    const createNewCertificate = () => dispatch(createCertificate({ certificate: { ...requestBody, owner: user.email } }));

    const editCertificate = () => dispatch(updateCertificate({ certificate: requestBody }, id));

    //disabled button
    const disabledCreateBtn = () => commonName  === '';

    const disabledSaveBtn = () => commonName === certificate.name && textCertificate === certificate.values.cert
            && textCaCertificate === certificate.values.ca && textPrivateKey === certificate.values.key
            && textDCaCertificate === certificate.values.dest_ca || commonName  === '';

    if (certificateUpdateStatus === 'fulfilled') {
        return <Redirect to={id ? certificateDetailsPath(menuGroup, id) : certificatesPath(menuGroup)} />;
    }

    return <>
        <ButtonBack path={id ? certificateDetailsPath(menuGroup, id) : certificatesPath(menuGroup)} />

        <Grid className='createCertificateForm'>
            <Grid.Row className='certificateHeader'>
                <Header as='h2'>
                    {id ? intl.formatMessage(messages.editCertificate) : intl.formatMessage(messages.createCertificate)}
                </Header>
            </Grid.Row >
            <Grid.Row className='certificateHeaderDescription'>
                <span>{intl.formatMessage(messages.certificateDescript)}</span>
            </Grid.Row>

            <Grid.Row style={{ paddingBottom: '5px' }}>
                <h5>{intl.formatMessage(messages.name)}</h5>
            </Grid.Row>
            <Grid.Row>
                <Input type='text' className='inputPath' style={{ width: '80%' }} value={commonName} onChange={onChangeName}/>
            </Grid.Row>

            <Grid.Row style={{ paddingBottom: '5px' }}>
                <h5>{intl.formatMessage(messages.certificate)}</h5>
            </Grid.Row>
            <div className='dragArea'
                onDrop={e => handleDrop(e, setTextCertificate)}
                onDragOver={e => handleDragOver(e)}
                onDragEnter={e => handleDragEnter(e)}
                onDragLeave={e => handleDragLeave(e)}
            >
                <Grid.Row style={{ paddingBottom: '0px' }}>
                    <Input type='text' value={pathCertificate} className='inputPath' action={true} onChange={onChangeCertificate}><input disabled/>
                        <Button onClick={onClickCertificate}>{intl.formatMessage(messages.browse)}</Button>
                    </Input><input
                        type='file'
                        ref={refCertificate}
                        onChange={e => callbackField(e, setPathCertificate, setTextCertificate)}
                        style={{ display: 'none' }}
                        accept='.pem'
                    />
                </Grid.Row>
                <Grid.Row style={{ margin: '5px 0' }}>
                    <span className='subTitleForm'>{intl.formatMessage(messages.certificateUpDescript)}</span>
                </Grid.Row>
                <Grid.Row>
                    <TextArea value={textCertificate} className='textAreaForCert' onChange={onChangeTextCertificate}/>
                </Grid.Row></div>

            <Grid.Row style={{ paddingBottom: '5px', marginTop: '10px'  }}>
                <h5>{intl.formatMessage(messages.privateKey)}</h5>
            </Grid.Row>
            <div className='dragArea'
                onDrop={e => handleDrop(e, setTextPrivateKey)}
                onDragOver={e => handleDragOver(e)}
                onDragEnter={e => handleDragEnter(e)}
                onDragLeave={e => handleDragLeave(e)}
            >
                <Grid.Row style={{ paddingBottom: '0px' }}>
                    <Input type='text' value={pathPrivateKey} className='inputPath' action={true} onChange={onChangePrivateKey}><input disabled/>
                        <Button onClick={onClickPrivateKey}>{intl.formatMessage(messages.browse)}</Button>
                    </Input>
                    <input
                        type='file'
                        ref={refPrivateKey}
                        onChange={e => callbackField(e, setPathPrivateKey, setTextPrivateKey)}
                        style={{ display: 'none' }}
                        accept='.pem'
                    />
                </Grid.Row>
                <Grid.Row style={{ margin: '5px 0' }}>
                    <span className='subTitleForm'>{intl.formatMessage(messages.certificateKeyDescript)}</span>
                </Grid.Row>
                <Grid.Row>
                    <TextArea value={textPrivateKey} className='textAreaForCert' onChange={onChangeTextPrivateKey}/>
                </Grid.Row></div>

            <Grid.Row style={{ paddingBottom: '5px', marginTop: '10px'  }}>
                <h5>{intl.formatMessage(messages.caCertificate)}</h5>
            </Grid.Row>
            <div className='dragArea'
                onDrop={e => handleDrop(e, setTextCaCertificate)}
                onDragOver={e => handleDragOver(e)}
                onDragEnter={e => handleDragEnter(e)}
                onDragLeave={e => handleDragLeave(e)}
            >
                <Grid.Row style={{ paddingBottom: '0px' }}>
                    <Input type='text' value={pathCaCertificate} className='inputPath' action={true} onChange={onChangeCaCertificate}>
                        <input disabled/>
                        <Button onClick={onClickCaCertificate}>{intl.formatMessage(messages.browse)}</Button>
                    </Input>
                    <input
                        type='file'
                        ref={refCaCertificate}
                        onChange={e => callbackField(e, setPathCaCertificate, setTextCaCertificate)}
                        style={{ display: 'none' }}
                        accept='.pem'
                    />
                </Grid.Row>
                <Grid.Row style={{ margin: '5px 0' }}>
                    <span className='subTitleForm'>{intl.formatMessage(messages.certificateCaDescript)}</span>
                </Grid.Row>
                <Grid.Row>
                    <TextArea value={textCaCertificate} className='textAreaForCert' onChange={onChangeTextCaCertificate}/>
                </Grid.Row></div>

            <Grid.Row style={{ paddingBottom: '5px', marginTop: '10px'  }}>
                <h5>{intl.formatMessage(messages.caCertificateDes)}</h5>
            </Grid.Row>
            <div className='dragArea'
                onDrop={e => handleDrop(e, setTextDCaCertificate)}
                onDragOver={e => handleDragOver(e)}
                onDragEnter={e => handleDragEnter(e)}
                onDragLeave={e => handleDragLeave(e)}
            >
                <Grid.Row style={{ paddingBottom: '0px' }}>
                    <Input type='text' value = {pathDCaCertificate} className='inputPath' action={true} onChange={onChangeDCaCertificate}>
                        <input disabled/>
                        <Button onClick={onClickDCaCertificate}>{intl.formatMessage(messages.browse)}</Button>
                    </Input>
                    <input
                        type='file'
                        ref={refDCaCertificate}
                        onChange={e => callbackField(e, setPathDCaCertificate, setTextDCaCertificate)}
                        style={{ display: 'none' }}
                    />
                </Grid.Row>
                <Grid.Row style={{ margin: '5px 0' }}>
                    <span className='subTitleForm'>{intl.formatMessage(messages.certificateDestDescript)}</span>
                </Grid.Row>
                <Grid.Row>
                    <TextArea value={textDCaCertificate} className='textAreaForCert' onChange={onChangeTextDCaCertificate}/>
                </Grid.Row></div>
        </Grid>

        <div className='footer'>
            <Button
                content={intl.formatMessage(messages.cancel)}
                onClick={()=>setIsOpenCancelChangesModal(true)}
            />
            <Button
                onClick={id ? editCertificate : createNewCertificate}
                primary
                type='submit'
                content={id ? intl.formatMessage(messages.save) : intl.formatMessage(messages.create)}
                disabled={id ? disabledSaveBtn() : disabledCreateBtn()}
            />
        </div>
        {isOpenCancelChangesModal && <CancelChangesModal
            open={isOpenCancelChangesModal}
            setOpen={openCancelChangesModal}
            type = 'forCertificate'
        />}
    </>;
};

CreateEditCertificate.propTypes = {
    intl: PropTypes.any,
    type: PropTypes.any,
    history: PropTypes.any
};

export default injectIntl(withRouter(CreateEditCertificate));
