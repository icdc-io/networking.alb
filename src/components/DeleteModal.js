import React from 'react';
import { Button, Header, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './loadBalancer.scss';

const DeleteModal = ({ t, open, setOpen, element, type, status, callback }) => {
    const disabled = () => status === 'pending' ? true : false;

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            size='tiny'
            className='deleteModalTraefik'
        >
            <Modal.Content>
                <div className='close-btn' onClick={() => setOpen(false)}></div>
                <Header as='h2' style={{ margin: 'auto 0 23px 0' }}>

                    {type === 'route' ? t('deleteRoute') : t('deleteCertificateHead')}

                </Header>
                {type !== 'route'
                    ? t('deleteCertificate', { name: <b>{element.name}</b> })
                    : t('deleteWebRoute', { name: <b>{element.name}</b> })}
                <p>{t('cannotBeUndone')}</p>
            </Modal.Content>
            <Modal.Actions className='deleteModalTraefikControl'>
                <Button onClick={() => setOpen(false)} content={t('cancel')} disabled={disabled()}/>
                <Button color='red' content={t('delete')} onClick={() => callback(element.id)} disabled={disabled()}/>

            </Modal.Actions>
        </Modal>
    );
};

DeleteModal.propTypes = {
    t: PropTypes.func,
    open: PropTypes.any,
    setOpen: PropTypes.func,
    element: PropTypes.object,
    type: PropTypes.string,
    status: PropTypes.string,
    callback: PropTypes.func
};

export default DeleteModal;
