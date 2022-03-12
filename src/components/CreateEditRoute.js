import React from 'react';
import { injectIntl } from 'react-intl';
import { useParams } from 'react-router';
import { Grid, Header } from 'semantic-ui-react';
import { detailsPath, webRoutesPath } from '../constants/routes';
import ButtonBack from '../general/buttonBack';
import { PropTypes } from 'prop-types';
import messages from '../Messages';
import CreateEditForm from './CreateEditForm';
import { withRouter } from 'react-router-dom';

const CreateEditRoute = ({ intl, history }) => {
    const { menuGroup, id } = useParams();

    window.goToRootRoute = () => history.push('/load_balancer');

    return <>
        <ButtonBack path={id ? detailsPath(menuGroup, id) : webRoutesPath(menuGroup)} />
        <Grid>
            <Grid.Row className='routeHeader'>
                <Header as='h2'>
                    {id ? intl.formatMessage(messages.editRoute) : intl.formatMessage(messages.createRoute)}
                </Header>
            </Grid.Row>
        </Grid>
        <CreateEditForm />
    </>;
};

CreateEditRoute.propTypes = {
    intl: PropTypes.any,
    history: PropTypes.any
};

export default injectIntl(withRouter(CreateEditRoute));
