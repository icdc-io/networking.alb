import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Button, Header, Input, Checkbox, Dropdown, Form, Radio } from 'semantic-ui-react';
import './loadBalancer.scss';
import { useParams, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CancelChangesModal from './CancelChangesModal';
import { createWebRouteData, fetchCertificates, fetchWebRoute, updateWebRoute, updateWebRouteReset, fetchWebRoutesService } from '../AppActions';
import FormField from './FormField';
import { detailsPath, webRoutesPath } from '../constants/routes';

const CreateEditForm = ({ t }) => {
    const { menuGroup, id } = useParams();
    const user = useSelector(state => state.host.user);
    const currentRoute = useSelector(state => state.BalancerStore.traefikRoute.route);
    const traefikRouteServices = useSelector(state => state.BalancerStore.traefikRouteServices);
    const currentRouteStatus = useSelector(state => state.BalancerStore.traefikRouteStatus);
    const traefikRouteUpdateStatus = useSelector((state) => state.BalancerStore.traefikRouteUpdateStatus);
    const certificates = useSelector(state => state.BalancerStore.certificates);
    const dispatch = useDispatch();

    const [isOpenCancelChangesModal, setIsOpenCancelChangesModal] = useState(false);
    let state = {
        /* eslint camelcase: 0 */
        name: '',
        hostname: '',
        path: '',
        target_port: '',
        tls_termination: '',
        insecure: '',
        certificate_id: '',
        owner: '',
        ip_version: '',
        cloud_gateway_id: 1,
        source_proto: 'tcp',
        destination_proto: 'tcp',
        services: []
    };
    let initialServices = [{ id: '' }];

    const [form, setForm] = useState(state);
    const [split, setSplit] = useState(false);
    const [secure, setSecure] = useState(false);
    const [listServices, setListServices] = useState(initialServices);
    const [ipv, setIpv] = useState(false);

    const tlsOptions = [{ text: 'edge', value: 'edge' }, { text: 'passthrough', value: 'passthrough' }, { text: 're-encrypt', value: 're-encrypt' }];
    const insecureOptions = [{ text: 'allow', value: 'allow' }, { text: 'redirect', value: 'redirect' }];
    const certificatesOptions = certificates.map(el => ({ text: el.name, value: el.id }));
    const servicesOptions = traefikRouteServices.map(el => ({ text: el.name, value: el.id, key: el.id }));

    //field validations
    const portValidation = new RegExp('^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$');
    const weightValidation = new RegExp('^(100|[1-9][0-9]?)$');
    let targetPortErr = !portValidation.test(form.target_port) && form.target_port !== '' ? true : false;
    let weightErr = (weight) => !weightValidation.test(weight) ? true : false;

    useEffect(() => {
        setListServices(initialServices);
        (id && currentRouteStatus === 'fulfilled') &&
		setForm({
            name: currentRoute.name,
            hostname: currentRoute.hostname,
            path: currentRoute.path,
            target_port: currentRoute.target_port,
            tls_termination: currentRoute.tls_termination,
            insecure: currentRoute.insecure === 'None' ? '' : currentRoute.insecure,
            certificate_id: currentRoute.certificate_id,
            owner: currentRoute.owner,
            ip_version: currentRoute.ip_version,
            cloud_gateway_id: currentRoute.cloud_gateway_id,
            source_proto: currentRoute.source_proto,
            destination_proto: currentRoute.destination_proto,
            services: currentRoute.services
		});

        (id && currentRouteStatus === 'fulfilled' && currentRoute.routes_services.length > 0) &&
        setListServices(currentRoute.routes_services.map(el => ({ id: el.service_id, weight: el.value })));

        (id && currentRouteStatus === 'fulfilled' && currentRoute.routes_services.length === 1) &&
        setListServices(currentRoute.routes_services.map(el => ({ id: el.service_id })));

        (id && currentRouteStatus === 'fulfilled' && currentRoute.services.length === 0) && setListServices(initialServices);

        (id && currentRouteStatus === 'fulfilled' && currentRoute.tls_termination !== '') &&
        setSecure(true);

        (id && currentRouteStatus === 'fulfilled' && currentRoute.services.length > 1) &&
		setSplit(true);

        (id && currentRouteStatus === 'fulfilled' && currentRoute.ip_version === '6') &&
		setIpv(true);

        dispatch(fetchWebRoutesService());
    }, [currentRoute, currentRouteStatus, id]);

    useEffect(() => {
        id &&  dispatch(fetchWebRoute(id));
        dispatch(updateWebRouteReset());
    }, [dispatch, id]);

    useEffect(() => {
        dispatch(fetchCertificates());
    }, []);

    useEffect(() => {
        !split && setListServices(listServices.filter((el, i) => i === 0).map(el => ({ id: el.id })));
        (split && (id !== undefined ? currentRoute.routes_services.length === 1 : listServices.length === 2)) &&
            setListServices([...listServices].map((el, i) => i === 0 ? ({ ...el, weight: 1 }) : el));
    }, [split, id]);

    useEffect(() => {
        !secure ? setForm({ ...form, tls_termination: '', certificate_id: null })
            : setForm({ ...form, tls_termination: tlsOptions[0].value });
    }, [secure]);

    useEffect(() => {
        listServices[1] === undefined && setSplit(false);
    }, [listServices]);

    const openCancelChangesModal = (isOpen = true) => {
        setIsOpenCancelChangesModal(isOpen);
    };

    //disabled buttons
    const disabledCreateBtn = () => form.name === '' || form.hostname === '' || targetPortErr
        || (listServices.length > 1 &&  listServices.some(el => weightErr(el.weight)));

    const addService = () => {
        setListServices([...listServices, { id: '', weight: '1' }]);
        setSplit(true);};

    const deleteService = (index) => {
        listServices.length > 1 ? setListServices(listServices.filter((e, i) => i !== index)) :
            setListServices(initialServices);
    };

    const createRouteHandler = () => {
        dispatch(createWebRouteData({ route: { ...form,
            path: form.path === '' ? '/' : form.path,
            owner: user.email,
            target_port: form.target_port === '' ? secure ? '443' : '80' : form.target_port,
            services: listServices.filter(el => el.id !== ''),
            ip_version: !ipv ? '4' : '6',
            insecure: form.insecure === '' ? 'None' : form.insecure
        } }));
        setForm(state);
        setListServices(initialServices);
    };

    const changeRouteHandler = () => {
        dispatch(updateWebRoute({
                route: { ...form,
                    path: form.path === '' ? '/' : form.path,
                    target_port: form.target_port === '' ? secure ? '443' : '80' : form.target_port,
                    services: listServices.filter(el => el.id !== ''),
                    ip_version: !ipv ? '4' : '6',
                    insecure: form.insecure === '' ? 'None' : form.insecure
                }
            }, id)
        );
    };

    const altServices = listServices.length > 1 ||  split ? listServices.map((s, index) =>
        <section className='addService' key={index}>
            <div className='firstField'>
                <label>{t('service')}</label>
                <Dropdown selection value={s.id} options={servicesOptions} placeholder='None' style={{ width: '98%' }}
                    onChange={(e, data) =>
                        setListServices(listServices.map((el, i) => i === index ? ({ ...el, id: data.value }) : ({ ...el })))} />
                <span className='subTitleForm'>{t('altService')}</span>
                <span className='altServiceControl' >
                    <p onClick={() => deleteService(index)}>{t('deleteService')}</p>|
                    <p onClick={addService}>{t('anotherService')}</p></span>
            </div>
            <div className='secondField'>
                <label>{t('weight')}</label>
                <Form.Field error={weightErr(s.weight)} >
                    <Input value={s.weight} type='text' style={{ width: '100%' }}
                        onChange={(e, data) =>
                            setListServices(listServices.map((el, i) => i === index ? ({ ...el, weight: data.value }) : ({ ...el })))} />
                </Form.Field>
                <span className='subTitleForm'>{t('weightDescript')}</span>
            </div>
        </section>)
        : <section className='addOneService'>
            <div>
                <label>{t('service')}</label>
                <Dropdown selection value={listServices[0]?.id} options={servicesOptions} placeholder='None' style={{ width: '100%' }}
                    onChange={(e, data) => setListServices(listServices.map(el => ({ ...el, id: data.value })))}/>
                <span className='subTitleForm'>{t('altService')}</span>
                <span className='altServiceControl'>
                    <p onClick={deleteService}>{t('deleteService')}</p>|
                    <p onClick={addService}>{t('anotherService')}</p></span>
            </div>
        </section>;

    if (traefikRouteUpdateStatus === 'fulfilled') {
        return <Redirect to={id ? detailsPath(menuGroup, id) : webRoutesPath(menuGroup)} />;
    }

    return <Form className='formContainer'>
        <div className='routeBlock'>
            <Header as='h4' style={{ marginBottom: '10px' }}>{t('general')}</Header>
            <FormField
                value={form.name}
                label={t('nameSecurityGroups')}
                placeholder='my-route'
                callback={e => setForm({ ...form, name: e.currentTarget.value })}
            />
            <span className='subTitleForm'>{t('traefikUniqName')}</span>

            <FormField
                value={form.hostname}
                label={t('hostname')}
                placeholder='www.example.com'
                callback={e => setForm({ ...form, hostname: e.currentTarget.value })}
            />
            <span className='subTitleForm'>{t('traefikPublHostname')}</span>

            <FormField
                value={form.path}
                label={`${t('path')} ${t('optional')}`}
                placeholder='/'
                callback={e => setForm({ ...form, path: e.currentTarget.value })}
            />
            <span className='subTitleForm'>{t('traefikPath')}</span>

            <FormField
                value={form.target_port}
                label={`${t('targetPort')} ${t('optional')}`}
                placeholder='443'
                callback={e => setForm({ ...form, target_port: e.currentTarget.value })}
                error={targetPortErr}
            />
            <span className='subTitleForm'>{t('traefikTargetPortDescript')}</span>
        </div>
        <div className='routeBlock'>
            <Header as='h4' style={{ marginBottom: '10px' }}>{t('traefikTargetServices')}</Header>
            <span className='subTitleForm'>{t('traefikSplitTrafficDescript')}</span>

            {altServices}
            <Form.Field style={{ marginTop: '10px' }}>
                <label>{t('ipInterface')}</label>
                <div className='ipv'>
                    <div>
                        <Radio
                            label='IPv4'
                            name='IPv4'
                            value='4'
                            checked={!ipv}
                            onChange={() => setIpv(prevState => !prevState)}
                        />
                        <Radio
                            label='IPv6'
                            name='IPv6'
                            value='6'
                            checked={ipv}
                            onChange={() => setIpv(prevState => !prevState)}
                            style={{ margin: '0px 10px' }}
                        />
                    </div>
                </div>
            </Form.Field>
        </div>
        <div className='routeBlock routeBlockColumn'>
            <Header as='h4'>{t('security')}</Header>
            <Checkbox label={t('traefikSecRoute')} checked={secure} onChange={(e, { checked }) => { setSecure(checked);}}/>
            <span className='subTitleForm'>{t('traefikSecRouteDescript')}</span>

            {secure && <>
                <label>{t('tlsTermination')}</label>
                <Dropdown selection value={form.tls_termination} options={tlsOptions} placeholder='None'
                    onChange={(param, data) => setForm({ ...form, tls_termination: data.value })}/>

                <label style={{ marginTop: '10px' }}>{t('traefikInsTraffic')}</label>
                <Dropdown selection clearable value={form.insecure} options={insecureOptions} placeholder='None'
                    onChange={(param, data) => setForm({ ...form, insecure: data.value })}/>
                <span className='subTitleForm'>{t('traefikInsTrafficDescript')}</span>

                <label>{t('traefikTlsCertificate')}</label>
                <Dropdown selection clearable value={form.certificate_id} options={certificatesOptions} placeholder='None'
                    onChange={(param, data) => setForm({ ...form, certificate_id: data.value })}/>
            </>}
        </div>
        <div className='formActions'>
            <Button
                content={t('cancel')}
                onClick={() => setIsOpenCancelChangesModal(true)}
            />
            <Button
                onClick={id ? changeRouteHandler : createRouteHandler}
                primary
                content={id ? t('save') : t('create')}
                disabled={disabledCreateBtn()}
            />
        </div>
        {isOpenCancelChangesModal && <CancelChangesModal
            t={t}
            open={isOpenCancelChangesModal}
            setOpen={openCancelChangesModal}
            type = 'forRoute'
        />}
    </Form>;
};

CreateEditForm.propTypes = {
    t: PropTypes.func,
    type: PropTypes.string
};

export default CreateEditForm;
