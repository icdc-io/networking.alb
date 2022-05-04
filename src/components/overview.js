import React from 'react';
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
import { PropTypes } from 'prop-types';

const WebRoutes = React.lazy(() => import('./WebRoutes'));
const Certificates = React.lazy(() => import('./Certificates'));
const CreateEditRoute = React.lazy(() => import('./CreateEditRoute'));
const WebRoutesDetails = React.lazy(() => import('./WebRoutesDetails'));
const CreateEditSertificate = React.lazy(() => import('./CreateEditSertificate'));
const CertificateDetails = React.lazy(() => import('./certificateDetailsPath'));

const LoadBalancerOverview = ({ t }) => {
    const menuItems = [
        {
            name: t('webRoutes'),
            path: 'web_routes',
            component: WebRoutes
        },
        {
            name: t('certificates'),
            path: 'certificates',
            component: Certificates
        }
    ];

    return <>
        <TabsLayout menuItems={menuItems} />
        <Segment attached='bottom'>
            <Switch>
                <Route exact path={webRoutesPath()} render={() => <WebRoutes t={t} /> } />
                <Route exact path={createroutePath()} render={() => <CreateEditRoute t={t} /> } />
                <Route exact path={editroutePath()} render={() => <CreateEditRoute t={t} /> } />
                <Route exact path={detailsPath()} render={() => <WebRoutesDetails t={t} /> } />

                <Route exact path={certificatesPath()} render={() => <Certificates t={t} /> } />
                <Route exact path={createCertificatePath()} render={() => <CreateEditSertificate t={t} /> } />
                <Route exact path={editCertificatePath()} render={() => <CreateEditSertificate t={t} /> } />
                <Route exact path={certificateDetailsPath()} render={() => <CertificateDetails t={t} /> } />
                <Redirect to={`/load_balancer/${menuItems[0].path}`} />
            </Switch>
        </Segment>
    </>;
};

LoadBalancerOverview.propTypes = {
    t: PropTypes.func
};

export default withRouter(LoadBalancerOverview);
