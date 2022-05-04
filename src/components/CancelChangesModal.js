import React from 'react';
import { Button, Header, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './loadBalancer.scss';
import { Link, useParams } from 'react-router-dom';
import { certificatesPath, webRoutesPath } from '../constants/routes';

const CancelChangesModal = ({ t, open, setOpen, type }) => {
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
                <Header as='h2' style={{ margin: 'auto 0 23px 0' }}>{t('cancelChanges')}</Header>
                <p>{t('sureCancelChanges')}</p>
            </Modal.Content>

            <Modal.Actions style={{ background: 'none' }} >
                <Button onClick={() => setOpen(false)} style={{marginRight: '10px'}} content={t('dismiss')} />
                <Link to={type !== 'forRoute' ? certificatesPath(menuGroup) : webRoutesPath(menuGroup)}>
                    <Button primary content={t('yesCancel')}/>
                </Link>
            </Modal.Actions>
        </Modal>
    );
};

CancelChangesModal.propTypes = {
    t: PropTypes.func,
    open: PropTypes.any,
    setOpen: PropTypes.func,
    type: PropTypes.string
};

export default CancelChangesModal;
