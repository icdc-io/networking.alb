import React from 'react';
import { useParams } from 'react-router';
import { Grid, Header } from 'semantic-ui-react';
import { detailsPath, webRoutesPath } from '../constants/routes';
import ButtonBack from '../general/buttonBack';
import { PropTypes } from 'prop-types';
import CreateEditForm from './CreateEditForm';
import { withRouter } from 'react-router-dom';

const CreateEditRoute = ({ t, history }) => {
    const { menuGroup, id } = useParams();

    window.goToRootRoute = () => history.push('/load_balancer');

    return <>
        <ButtonBack back={t('back')} path={id ? detailsPath(menuGroup, id) : webRoutesPath(menuGroup)} />
        <Grid>
            <Grid.Row className='routeHeader'>
                <Header as='h2'>
                    {id ? t('editRoute') : t('createRoute')}
                </Header>
            </Grid.Row>
        </Grid>
        <CreateEditForm t={t} />
    </>;
};

CreateEditRoute.propTypes = {
    t: PropTypes.func,
    history: PropTypes.any
};

export default withRouter(CreateEditRoute);
