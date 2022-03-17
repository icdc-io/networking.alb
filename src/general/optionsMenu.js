/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { certificateDetailsPath, detailsPath } from '../constants/routes';
import { Link, useParams } from 'react-router-dom';

const OptionsMenu = ({ t, type, instance, options }) => {
    const { menuGroup } = useParams();
    const actions = {
        traefik: {
            viewRoutes: (route, key) => <Link key={key} to={detailsPath(menuGroup, route.id)} role='option' className='item'>
                <Dropdown.Item text={t('viewWebRoute')} onClick={() => { }} />
            </Link>,
            viewCertificate: (route, key) => <Link key={key} to={certificateDetailsPath(menuGroup, route.id)} role='option' className='item'>
                <Dropdown.Item text={t('viewWebRoute')} />
            </Link>
        }
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
    t: PropTypes.func,
    instance: PropTypes.object,
    type: PropTypes.string,
    options: PropTypes.array,
    onClickAction: PropTypes.func
};

export default OptionsMenu;
