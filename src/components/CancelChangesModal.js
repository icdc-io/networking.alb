import React from 'react';
import { Button, Header, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import messages from '../Messages';
import './loadBalancer.scss';
import { Link, useParams } from 'react-router-dom';
import { certificatesPath, webRoutesPath } from '../constants/routes';

const CancelChangesModal = ({ intl, open, setOpen, type }) => {
    const { menuGroup } = useParams(); //добавить id если возвращаемся на details страницу
    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            size='tiny'
            className='cancelChangesModal'
        >
            <Modal.Content>
                <div className='close-btn' onClick={() => setOpen(false)}></div>
                <Header as='h2' style={{ margin: 'auto 0 23px 0' }}>{intl.formatMessage(messages.cancelChanges)}</Header>
                <p>{intl.formatMessage(messages.sureCancelChanges)}</p>
            </Modal.Content>

            <Modal.Actions style={{ background: 'none' }} >
                <Button onClick={() => setOpen(false)} content={intl.formatMessage(messages.dismiss)} />
                <Link to={type !== 'forRoute' ? certificatesPath(menuGroup) : webRoutesPath(menuGroup)}>
                    <Button primary content={intl.formatMessage(messages.yesCancel)}/>
                </Link>
            </Modal.Actions>
        </Modal>
    );
};

CancelChangesModal.propTypes = {
    intl: PropTypes.any,
    open: PropTypes.any,
    setOpen: PropTypes.func,
    type: PropTypes.string
};

export default injectIntl(CancelChangesModal);
