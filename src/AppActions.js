import * as ActionTypes from './AppConstants';
import { fetchData, createData, updateData, deleteData } from 'container/Api';
import cogoToast from 'cogo-toast';

const notificationOptions = { position: 'top-right', hideAfter: 7 };

const errorHandler = (error) => {
    if (error.includes('Could not find security_group with such id')) {
        return ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].sgNotExist;
    }

    if (error.includes('Firewall rule edit error')) {
        return ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].ruleEditError;
    }

    if (error.includes('Could not find network_router with such id')) {
        return ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].routerNotExist;
    }

    if (error.includes('401')) {
        return ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].unauthorized;
    }

    if (error.includes('Rule already exists')) {
        return ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].ruleAlreadyExists;
    }

    if (error.includes(`Can't delete security group with assigned NICs`)) {
        return ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].cannotDeleteGroupWithAssignedVmsNics;
    }

    return '';
};

const errorNotification = (error) => {
    const errorTypeCheck = error instanceof Object ? error.message : error;
    cogoToast.error(ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].error +
        errorHandler(errorTypeCheck), notificationOptions);
};

const successNotification = (msg) =>
    cogoToast.success(ActionTypes.notificationMessages[localStorage.getItem('icdc-lang') || 'en'].success + msg, notificationOptions);

export const infoNotification = (msg) =>
    cogoToast.info(msg, notificationOptions);

const getFullPath = (url, id = '') => `/api/traefik_manager/v1${url}/${id}`;

export const fetchWebRoutes = () => ({
    type: ActionTypes.WEB_ROUTES_FETCH,
    payload: fetchData(getFullPath(ActionTypes.WEB_ROUTES_FETCH_URL))
});

export const fetchWebRoute = (id) => ({
    type: ActionTypes.WEB_ROUTE_FETCH,
    payload: fetchData(getFullPath(ActionTypes.WEB_ROUTES_FETCH_URL, id))
});

export const fetchWebRoutesService = () => ({
    type: ActionTypes.WEB_ROUTES_SERVICES_FETCH,
    payload: fetchData(getFullPath(ActionTypes.WEB_ROUTES_SERVICES_FETCH_URL))
});

const createWebRoute = (payload) => ({
    type: ActionTypes.WEB_ROUTE_CREATE,
    payload: createData(getFullPath(ActionTypes.WEB_ROUTES_FETCH_URL), payload)
});

export const createWebRouteData = (payload) => {
    return dispatch => {
        const response = dispatch(createWebRoute(payload));

        response.then(() => {
            successNotification('');
        }, error => errorNotification(error));
    };
};

const deleteWebRouteAction = (id) => ({
    type: ActionTypes.WEB_ROUTE_DELETE,
    payload: deleteData(getFullPath(ActionTypes.webRouteUrl(id)))
});

export const deleteWebRouteReset = () => ({
    type: ActionTypes.WEB_ROUTE_DELETE_RESET
});

export const deleteWebRoute = (id) => {
    return dispatch => {
        const response = dispatch(deleteWebRouteAction(id));

        response.then(() => {
            successNotification('');
            dispatch(fetchWebRoutes());
            dispatch(deleteWebRouteReset());
            
        }, error => errorNotification(error));
    };
};

const updateWebRouteData = (payload, routeId) => ({
    type: ActionTypes.WEB_ROUTE_UPDATE,
    payload: updateData(getFullPath(ActionTypes.webRouteUrl(routeId)), payload)
});

export const updateWebRoute = (payload, routeId) => {
    return dispatch => {
        const response = dispatch(updateWebRouteData(payload, routeId));

        response.then(() => {
            successNotification('');
            dispatch(updateWebRouteReset());
        }, error => {
            errorNotification(error);
        });
    };
};

export const updateWebRouteReset = () => ({
    type: ActionTypes.WEB_ROUTE_UPDATE_RESET
});

export const fetchGateways = () => ({
    type: ActionTypes.WEB_ROUTES_GATEWAYS_FETCH,
    payload: fetchData(getFullPath(ActionTypes.WEB_ROUTES_GATEWAYS_FETCH_URL))
});


export const fetchCertificates = () => ({
    type: ActionTypes.CERTIFICATES_FETCH,
    payload: fetchData(getFullPath(ActionTypes.CERTIFICATES_FETCH_URL))
});

const fetchCertificateData = (id) => ({
    type: ActionTypes.CERTIFICATE_FETCH,
    payload: fetchData(getFullPath(ActionTypes.CERTIFICATES_FETCH_URL, id))
});

export const fetchCertificate = (id) => {
    return dispatch => {
        const response = dispatch(fetchCertificateData(id));
        response.catch(error => errorNotification(error));
    };
};

const createCertificateData = (payload) => ({
    type: ActionTypes.CERTIFICATE_CREATE,
    payload: createData(getFullPath(ActionTypes.CERTIFICATES_FETCH_URL), payload)
});

export const createCertificate = (payload) => {
    return dispatch => {
        const response = dispatch(createCertificateData(payload));

        response.then(() => {
            successNotification('');
        }, error => errorNotification(error));
    };
};

const updateCertificateData = (payload, certificateId) => ({
    type: ActionTypes.CERTIFICATE_UPDATE,
    payload: updateData(getFullPath(ActionTypes.certificateUrl(certificateId)), payload)
});

export const updateCertificate = (data, certificateId) => {
    return dispatch => {
        const response = dispatch(updateCertificateData(data, certificateId));

        response.then(() => {
            dispatch(updateCertificateReset());
            successNotification('');
        }, error => {
            errorNotification(error);
        });
    };
};

export const updateCertificateReset = () => ({
    type: `${ActionTypes.CERTIFICATE_UPDATE}_RESET`
});

const deleteCertificateAction = (id) => ({
    type: ActionTypes.CERTIFICATE_DELETE,
    payload: deleteData(getFullPath(ActionTypes.certificateUrl(id)))
});

const deleteCertificateReset = () => ({
    type: ActionTypes.CERTIFICATE_DELETE_RESET
});

export const deleteCertificate = (id) => dispatch => {
    const response = dispatch(deleteCertificateAction(id));
    response.then(() => {
        successNotification('');
        dispatch(fetchCertificates());
        dispatch(deleteCertificateReset());
    }, error => {
        errorNotification(error);
    });
};
