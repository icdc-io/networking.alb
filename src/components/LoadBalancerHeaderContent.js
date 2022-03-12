import React from 'react';
import messages from '../Messages';
import { useParams } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Grid, Button } from 'semantic-ui-react';
import ItemHeader from '../general/itemHeader';
import { Link } from 'react-router-dom';
import { createCertificatePath, createroutePath } from '../constants/routes';

const LoadBalancerHeaderContent = ({ intl, isNoData, isWebRoutes, title }) => {
    const { menuGroup } = useParams();

    return (
        <Grid.Row className="content-page__header" style={isNoData && isWebRoutes ? { paddingTop: '0px' } : {}}>
            <ItemHeader title={isNoData && isWebRoutes ? messages.webRoutes : title} traefik={true}/>
            { isNoData && (
                <Link to={isWebRoutes ? createroutePath(menuGroup) : createCertificatePath(menuGroup)}>
                    <Button primary size="medium" style={!isWebRoutes ? { marginTop: '12px' } : {}} className='tempButtonforTraefik'>
                        {intl.formatMessage(messages[isWebRoutes ? 'createRoute' : 'createCertificate'])}
                    </Button>
                </Link>
            )}
        </Grid.Row>
    );
};

LoadBalancerHeaderContent.propTypes = {
    intl: PropTypes.any,
    isNoData: PropTypes.bool,
    isWebRoutes: PropTypes.bool,
    title: PropTypes.string
};

export default injectIntl(LoadBalancerHeaderContent);
