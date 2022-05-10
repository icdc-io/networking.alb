/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { editroutePath, editCertificatePath } from '../constants/routes';
import { Link, useParams } from 'react-router-dom';
import DeleteModal from '../components/DeleteModal';

const OptionsMenu = ({ t, type, instance, options }) => {
    const { menuGroup } = useParams();
    const actions = {
        certificates: {
            edit: (certificate, key) => <Link key={key} to={editCertificatePath(menuGroup, certificate.id)} role='option' className='item'>
                <Dropdown.Item text={t('edit')} />
            </Link>,
            deleteCertificate: (certificate, key) => <DeleteModal t={t} key={key} type={type} instance={certificate} />
        },
        webRoutes: {
            edit: (webRoute, key) => <Link key={key} to={editroutePath(menuGroup, webRoute.id)} role='option' className='item'>
                <Dropdown.Item text={t('edit')} onClick={() => { }} />
            </Link>,
            deleteWebRoutes: (webRoute, key) => <DeleteModal key={key} type={type} instance={webRoute} t={t}/>
        },
    };

    return (
        <Dropdown direction='left' icon='ellipsis vertical' className='users-list__actions_dot'>
            <Dropdown.Menu>
                {options.map((option, key) => actions[type][option](instance, key))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

OptionsMenu.propTypes = {
    t: PropTypes.any,
    instance: PropTypes.object,
    type: PropTypes.string,
    options: PropTypes.array,
    onClickAction: PropTypes.func
};

export default OptionsMenu;
