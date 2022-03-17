import React from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { createCertificatePath, createroutePath } from '../constants/routes';

const ItemHeader = React.lazy(() => import('container/ItemHeader'));

const LoadBalancerHeaderContent = ({ t, isNoData, isWebRoutes, title }) => {
    const { menuGroup } = useParams();

    return (
        <Grid.Row className="content-page__header" style={isNoData && isWebRoutes ? { paddingTop: '0px' } : {}}>
            <ItemHeader title={isNoData && isWebRoutes ? t('webRoutes') : t(title)} traefik={true}/>
            { isNoData && (
                <Link to={isWebRoutes ? createroutePath(menuGroup) : createCertificatePath(menuGroup)}>
                    <Button primary size="medium" style={!isWebRoutes ? { marginTop: '12px' } : {}} className='tempButtonforTraefik'>
                        {t([isWebRoutes ? 'createRoute' : 'createCertificate'])}
                    </Button>
                </Link>
            )}
        </Grid.Row>
    );
};

LoadBalancerHeaderContent.propTypes = {
    t: PropTypes.func,
    isNoData: PropTypes.bool,
    isWebRoutes: PropTypes.bool,
    title: PropTypes.string
};

export default LoadBalancerHeaderContent;
