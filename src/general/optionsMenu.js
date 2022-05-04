/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { certificateDetailsPath, detailsPath, editroutePath, editCertificatePath } from '../constants/routes';
import { Link, useParams } from 'react-router-dom';
import DeleteModal from '../components/DeleteModal';

const OptionsMenu = ({ t, type, instance, options }) => {
    const { menuGroup } = useParams();
    const actions = {
        certificates: {
            edit: (webRoute, key) => <Link key={key} to={editCertificatePath(menuGroup, webRoute.id)} role='option' className='item'>
                <Dropdown.Item text={t('edit')} />
            </Link>,
            deleteCertificate: (certificate, key) => <DeleteModal t={t} key={key} type={type} instance={certificate} />
        },
        traefik: {
            viewRoutes: (route, key) => <Link key={key} to={detailsPath(menuGroup, route.id)} role='option' className='item'>
                <Dropdown.Item text={t('viewWebRoute')} onClick={() => { }} />
            </Link>,
            viewCertificate: (route, key) => <Link key={key} to={certificateDetailsPath(menuGroup, route.id)} role='option' className='item'>
                <Dropdown.Item text={t('viewWebRoute')} />
            </Link>
        },
        // webRoutes: {
        //     edit: (webRoute, key) => <Link key={key} to={editroutePath(menuGroup, webRoute.id)} role='option' className='item'>
        //         <Dropdown.Item text={t('edit')} onClick={() => { }} />
        //     </Link>,
        //     deleteWebRoutes: (webRoute, key) => <DeleteModal key={key} type={type} instance={webRoute} />
        // },
        // certificates: {
        //     edit: (webRoute, key) =>  <Link key={key} to={editCertificatePath(menuGroup, webRoute.id)} role='option' className='item'>
        //         <Dropdown.Item text={t('edit')}/>
        //     </Link>,
        //     deleteCertificate: (certificate, key) => <DeleteModal key={key} type={type} instance={certificate} />
        // }
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
