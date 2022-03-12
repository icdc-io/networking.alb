import React from 'react';
import { injectIntl } from 'react-intl';
import { Redirect, withRouter, Switch, Route } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import TabsLayout from './tabsLayout';
import {
    certificatesPath,
    webRoutesPath,
    createroutePath,
    editroutePath,
    createCertificatePath,
    editCertificatePath,
    certificateDetailsPath,
    detailsPath
} from '../constants/routes';
import messages from '../Messages';
import { PropTypes } from 'prop-types';

const WebRoutes = React.lazy(() => import('./WebRoutes'));
const Certificates = React.lazy(() => import('./Certificates'));
const CreateEditRoute = React.lazy(() => import('./CreateEditRoute'));
const WebRoutesDetails = React.lazy(() => import('./WebRoutesDetails'));
const CreateEditSertificate = React.lazy(() => import('./CreateEditSertificate'));
const CertificateDetails = React.lazy(() => import('./CreateEditSertificate'));

const LoadBalancerOverview = ({ intl }) => {
    const menuItems = [
        {
            name: intl.formatMessage(messages.webRoutes),
            path: 'web_routes',
            component: WebRoutes
        },
        {
            name: intl.formatMessage(messages.certificates),
            path: 'certificates',
            component: Certificates
        }
    ];

    return <>
        <TabsLayout menuItems={menuItems} />
        <Segment attached='bottom'>
            <Switch>
                <Route exact path={webRoutesPath()} component={ WebRoutes } />
                <Route exact path={createroutePath()} component={ CreateEditRoute } />
                <Route exact path={editroutePath()} component={ CreateEditRoute } />
                <Route exact path={detailsPath()} component={ WebRoutesDetails } />

                <Route exact path={certificatesPath()} component={ Certificates } />
                <Route exact path={createCertificatePath()} component={ CreateEditSertificate } />
                <Route exact path={editCertificatePath()} component={ CreateEditSertificate } />
                <Route exact path={certificateDetailsPath()} component={ CertificateDetails } />
                <Redirect to={`/load_balancer/${menuItems[0].path}`} />
            </Switch>
        </Segment>
    </>;
};

LoadBalancerOverview.propTypes = {
    intl: PropTypes.any
};

export default injectIntl(withRouter(LoadBalancerOverview));
