import React from 'react';
import { Button, Header, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import messages from '../Messages';
import './loadBalancer.scss';

const DeleteModal = ({ intl, open, setOpen, element, type, status, callback }) => {
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

                    {type === 'route' ? intl.formatMessage(messages.deleteRoute) : intl.formatMessage(messages.deleteCertificateHead)}

                </Header>
                {type !== 'route'
                    ? intl.formatMessage(messages.deleteCertificate, { name: <b>{element.name}</b> })
                    : intl.formatMessage(messages.deleteWebRoute, { name: <b>{element.name}</b> })}
                <p>{intl.formatMessage(messages.cannotBeUndone)}</p>
            </Modal.Content>
            <Modal.Actions className='deleteModalTraefikControl'>
                <Button onClick={() => setOpen(false)} content={intl.formatMessage(messages.cancel)} disabled={disabled()}/>
                <Button color='red' content={intl.formatMessage(messages.delete)} onClick={() => callback(element.id)} disabled={disabled()}/>

            </Modal.Actions>
        </Modal>
    );
};

DeleteModal.propTypes = {
    intl: PropTypes.any,
    open: PropTypes.any,
    setOpen: PropTypes.func,
    element: PropTypes.object,
    type: PropTypes.string,
    status: PropTypes.string,
    callback: PropTypes.func
};

export default injectIntl(DeleteModal);
