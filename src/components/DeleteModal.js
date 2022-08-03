import React, { useState, useCallback } from 'react';
import { Modal, Button, Header, Dropdown, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {
    deleteCertificate,
    deleteWebRoute
} from '../AppActions';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { certificatesPath, webRoutesPath } from '../constants/routes';
import DangerousHTML from 'react-dangerous-html';

const DeleteModal = ({ t, type, instance, icon, button, history }) => {
    const [isVisible, setIsVisible] = useState(false);
    const { zoneName, menuGroup } = useParams();
    const user = useSelector(state => state.host.user);

    const dispatch = useDispatch();

    const types = {
        certificates: {
            item: 'delete',
            header: 'deleteCertificateHead',
            content: ['deleteCertificate'],
            textOptions: { name: `<b>${instance.name}</b>` },
            deleteAction: useCallback(
                () => {
                    dispatch(deleteCertificate(instance.id));
                    button && history.push(certificatesPath(menuGroup));
                },
                [dispatch, instance.id, button, history, menuGroup]
            )
        },
        webRoutes: {
            item: 'delete',
            header: 'deleteRoute',
            content: ['deleteWebRoute'],
            textOptions: { name: `<b>${instance.name}</b>` },
            deleteAction: useCallback(
                () => {
                    dispatch(deleteWebRoute(instance.id));
                    button && history.push(webRoutesPath(menuGroup));
                },
                [dispatch, instance.id, button, history, menuGroup]
            )
        }
    };
    const deleteButtonIsAvailable = types[type].content[0] === 'deleteWebRoute' || types[type].content[0] === 'deleteCertificate';

    const showModal = () => {
        setIsVisible(true);
    };

    const closeModal = () => {
        setIsVisible(false);
    };

    const onConfirm = () => {
        closeModal();
        types[type].deleteAction(instance);
    };

    const modalText = (modalContent, textOptions) => modalContent.map((text, index) =>
        <Modal.Description as='p' content={ <DangerousHTML html={t(text, textOptions)} />} key={index} />);

    const modalTextWithName = (modalContent) => <Modal.Description as='p' content={t(modalContent[0], modalContent[1])} />;

    const hasAssignedVms = type === 'networks' && instance.assignedVms && instance.assignedVms.length > 0;

    const buttonModal = button ?
        <Button
            onClick={showModal}
            basic size='small' color='red'
            content={t(types[type].item)}
            className='delete-route-button'
            disabled={hasAssignedVms}
        /> :
        icon ?
            <Icon name="trash alternate outline" onClick={showModal} />
            :
            <Dropdown.Item onClick={showModal} className='delete'>{t(types[type].item)}</Dropdown.Item>;

    return (
        (user.role === 'admin' || deleteButtonIsAvailable) && <>
            {buttonModal}
            <Modal open={isVisible} size='mini' onClick={closeModal} closeIcon>
                <Header as='h3' content={t(types[type].header)} />
                <Modal.Content content={modalText(types[type].content, types[type].textOptions || {})}  style={{padding:'0 21px'}} />
                {types[type].contentNamed && <Modal.Content style={{padding:'0 21px'}} content={modalTextWithName(types[type].contentNamed)} />}
                <Modal.Content style={{padding:'0 21px'}} content={t('cannotBeUndone')} />
                <Modal.Actions align='center'>
                    <Button onClick={closeModal} content={t('cancel')} />
                    <Button
                        color='red'
                        type='submit'
                        onClick={onConfirm}
                        content={t(type === 'networks' ? 'delete' : 'confirm')}
                    />
                </Modal.Actions>
            </Modal>
        </>
    );
};

DeleteModal.propTypes = {
    t: PropTypes.any,
    type: PropTypes.string,
    instance: PropTypes.object,
    button: PropTypes.bool,
    icon: PropTypes.bool,
    history: PropTypes.object
};

export default DeleteModal;
