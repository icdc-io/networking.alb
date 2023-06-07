import React, { useEffect, useRef, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Button, Grid, Header, Input, TextArea } from 'semantic-ui-react';
import './loadBalancer.scss';
import { useParams, Redirect } from 'react-router-dom';
import { certificateDetailsPath, certificatesPath } from '../constants/routes';
import ButtonBack from '../general/buttonBack';
import CancelChangesModal from './CancelChangesModal';
import { useSelector, useDispatch } from 'react-redux';
import { createCertificate, updateCertificate } from '../AppActions';
import { withRouter } from 'react-router-dom';

const CreateEditCertificate = ({ t, history }) => {
    const { menuGroup, id } = useParams();
    let refCertificate = useRef(null);
    const userEmail = JSON.parse(localStorage.getItem('user')).email;
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
    const initialCertificatesData = {
        pathCertificate: '',
        textCertificate: '',
        pathPrivateKey: '',
        textPrivateKey: '',
        pathCaCertificate: '',
        textCaCertificate: '',
        pathDCaCertificate: '',
        textDCaCertificate: ''
    };

    const [certificatesData, setCertificatesData] = useState(initialCertificatesData)
    const [commonName, setCommonName] = useState('');
    const [isOpenCancelChangesModal, setIsOpenCancelChangesModal] = useState(false);
    const [requestBody, setRequestBody] = useState(initialState);

    const pathToRedirect = id ? certificateDetailsPath(menuGroup, id) : certificatesPath(menuGroup);

    window.goToRootRoute = () => history.push('/load_balancer');

    useEffect(() => {
        !id && setRequestBody({ ...requestBody, owner: userEmail });
    }, [id, userEmail]);

    useEffect(() => {
        setRequestBody({ ...requestBody,
            name: commonName,
            cert: certificatesData.textCertificate,
            key: certificatesData.textPrivateKey,
            ca: certificatesData.textCaCertificate,
            dest_ca: certificatesData.textDCaCertificate });
    }, [commonName, certificatesData]);

    useEffect(()=>{
        if (id) {
            setCommonName(certificate.name);

            setCertificatesData({...certificatesData, 
                pathCertificate: certificate.values?.cert,
                textCertificate: certificate.cert_path,
                pathPrivateKey: certificate.key_path,
                textPrivateKey: certificate.values?.key,
                pathCaCertificate: certificate.ca_path,
                textCaCertificate: certificate.values?.ca,
                pathDCaCertificate: certificate.dest_ca_path,
                textDCaCertificate: certificate.values?.dest_ca});

            setRequestBody({ ...requestBody, owner: certificate.owner });
        }
    }, [id]);

    const openCancelChangesModal = (isOpen = true) => {
        setIsOpenCancelChangesModal(isOpen);
    };

    const handleFile = (e, path, text, action) => {
        e.preventDefault();
        let data = action === 'drop' ? e.dataTransfer : e.currentTarget.value.split('\\');
        let file = action === 'drop' ? data.files[0] : e.target.files[0];
        let reader = new FileReader();
        if (file) {
            reader.readAsText(file);
            reader.onloadend = () => {
                setCertificatesData({...certificatesData, [text]: reader.result, [path]: action === 'drop' ? file.name : data[data.length-1]});
            };
        }
    }
    //onChange callbacks
    const onChangeName = (e) => setCommonName(e.currentTarget.value);
    const onChangeField = (e, item) => setCertificatesData({...certificatesData, [item]: e.currentTarget.value});

    const createNewCertificate = () => dispatch(createCertificate({ certificate: { ...requestBody, owner: userEmail } }));
    const editCertificate = () => dispatch(updateCertificate({ certificate: requestBody }, id));

    //disabled button
    const disabledCreateBtn = () => commonName  === '';

    const disabledSaveBtn = () => commonName === certificate.name && certificatesData.textCertificate === certificate.values?.cert
            && certificatesData.textCaCertificate === certificate.values?.ca && certificatesData.textPrivateKey === certificate.values?.key
            && certificatesData.textDCaCertificate === certificate.values?.dest_ca || commonName  === '';

    const certificatesFields = [
        {
            title: 'certificate',
            description: 'certificateUpDescript',
            path: 'pathCertificate',
            text: 'textCertificate'
        },
        {
            title: 'privateKey',
            description: 'certificateKeyDescript',
            path: 'pathPrivateKey',
            text: 'textPrivateKey'
        },
        {
            title: 'caCertificate',
            description: 'certificateCaDescript',
            path: 'pathCaCertificate',
            text: 'textCaCertificate'
        },
        {
            title: 'caCertificateDes',
            description: 'certificateDestDescript',
            path: 'pathDCaCertificate',
            text: 'textDCaCertificate'
        }
    ];

    const displayCertificatesFileds = certificatesFields.map((el, index) => {
        const onClickCertificate = (index) => {
            refCertificate.current.children[index].children[1].children[0].children[1].click();
            // refCertificate.current.click();
        };
        //Drag & Drop upload file
        const handleDragEnter = e => e.preventDefault();

        const handleDragLeave = e => e.preventDefault();

        const handleDragOver = e => e.preventDefault();
        return (<div key={index} className="fields-wrapper">
            <Grid.Row style={{ paddingBottom: '5px' }}>
                <h5>{t(el.title)}</h5>
            </Grid.Row>
            <div className='dragArea'
                onDrop={e => handleFile(e, el.path, el.text, 'drop')}
                onDragOver={e => handleDragOver(e)}
                onDragEnter={e => handleDragEnter(e)}
                onDragLeave={e => handleDragLeave(e)}
            >
                <Grid.Row style={{ paddingBottom: '0px' }}>
                    <Input type='text' value={certificatesData[el.path]} className='inputPath' action={true} onChange={(e) => onChangeField(e, el.path)}><input disabled/>
                        <Button onClick={() => onClickCertificate(index)}>{t('browse')}</Button>
                    </Input><input
                        type='file'
                        // ref={refCertificate}
                        // name={el.text}
                        onChange={e => handleFile(e, el.path, el.text, 'callbackField')}
                        style={{ display: 'none' }}
                        accept='.pem'
                    />
                </Grid.Row>
                <Grid.Row style={{ margin: '5px 0' }}>
                    <span className='subTitleForm'>{t(el.description)}</span>
                </Grid.Row>
                <Grid.Row>
                    <TextArea value={certificatesData[el.text]} className='textAreaForCert' onChange={(e) => onChangeField(e, el.text)}/>
                </Grid.Row></div>
    </div>)});

    if (certificateUpdateStatus === 'fulfilled') {
        return <Redirect to={pathToRedirect} />;
    }

    return <>
        <ButtonBack back={t('back')} path={pathToRedirect} />

        <Grid className='createCertificateForm'>
            <Grid.Row className='certificateHeader'>
                <Header as='h2'>
                    {id ? t('editCertificate') : t('createCertificate')}
                </Header>
            </Grid.Row >
            <Grid.Row className='certificateHeaderDescription'>
                <span>{t('certificateDescript')}</span>
            </Grid.Row>

            <Grid.Row style={{ paddingBottom: '5px' }}>
                <h5>{t('name')}</h5>
            </Grid.Row>
            <Grid.Row>
                <Input type='text' className='inputPath' style={{ width: '80%' }} value={commonName} onChange={onChangeName}/>
            </Grid.Row>
            <div ref={refCertificate} className='inputs-wrapper'>
                {displayCertificatesFileds}
            </div>
        </Grid>

        <div className='footer'>
            <Button
                content={t('cancel')}
                onClick={()=>setIsOpenCancelChangesModal(true)}
                style={{marginRight: '10px'}}
            />
            <Button
                onClick={id ? editCertificate : createNewCertificate}
                primary
                type='submit'
                content={id ? t('save') : t('create')}
                disabled={id ? disabledSaveBtn() : disabledCreateBtn()}
            />
        </div>
        {isOpenCancelChangesModal && <CancelChangesModal
            t={t}
            open={isOpenCancelChangesModal}
            setOpen={openCancelChangesModal}
            type = 'forCertificate'
        />}
    </>;
};

CreateEditCertificate.propTypes = {
    t: PropTypes.func,
    type: PropTypes.any,
    history: PropTypes.any
};

export default withRouter(CreateEditCertificate);
