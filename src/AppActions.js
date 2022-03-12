import * as ActionTypes from './AppConstants';
import API from './utilities/Api';
import cogoToast from 'cogo-toast';

const waitingForBaseUrl = () => {
    const { locations } = window.insights.getUserInfo().external;
    const location = window.insights.getLocation();
    return locations[location];
};

const baseForTraefik = (url, id = '') => `${waitingForBaseUrl()}/api/traefik_manager/v1${url}/${id}`;

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

const expandHeaders = (headers) => {
    const account = window.insights.getAccount();
    const role = window.insights.getRole();

    return {
        ...headers,
        Authorization: `Bearer ${window.insights.getToken()}`,
        X_MIQ_GROUP: `${account.toLowerCase()}.${role.toLowerCase()}`,
        'x-icdc-role': role,
        'x-icdc-account': account
    };
};

const fetchData = async (url, headers, id) => {
    const response = await API.get(baseForTraefik(url, id), expandHeaders(headers));
    return response.data;
};

const createData = async (url, headers, payload) => {
    const response = await API.post(baseForTraefik(url), expandHeaders(headers), payload);
    return response.data;
};

const updateData = async (url, headers, payload, id) => {
    const response = await API.put(baseForTraefik(url, id), payload, expandHeaders(headers));
    return response.data;
};

const deleteData = async (url, headers, id) => {
    const response = await API.delete(baseForTraefik(url, id), expandHeaders(headers));
    return response;
};

export const fetchWebRoutes = () => ({
    type: ActionTypes.WEB_ROUTES_FETCH,
    payload: fetchData(ActionTypes.WEB_ROUTES_FETCH_URL, {})
});

export const fetchWebRoute = (id) => ({
    type: ActionTypes.WEB_ROUTE_FETCH,
    payload: fetchData(ActionTypes.WEB_ROUTES_FETCH_URL, {}, id)
});

export const fetchWebRoutesService = () => ({
    type: ActionTypes.WEB_ROUTES_SERVICES_FETCH,
    payload: fetchData(ActionTypes.WEB_ROUTES_SERVICES_FETCH_URL, {})
});

const createWebRoute = (payload) => ({
    type: ActionTypes.WEB_ROUTE_CREATE,
    payload: createData(ActionTypes.WEB_ROUTES_FETCH_URL, {}, payload)
});

export const createWebRouteData = (payload) => {
    return dispatch => {
        const response = dispatch(createWebRoute(payload));

        response.then(() => {
            successNotification('');
        }, error => errorNotification(error));
    };
};

const deleteWebRoute = (id) => ({
    type: ActionTypes.WEB_ROUTE_DELETE,
    payload: deleteData(ActionTypes.WEB_ROUTES_FETCH_URL, {}, id)
});

export const deleteWebRouteAction = (id) => {
    return dispatch => {
        const response = dispatch(deleteWebRoute(id));

        response.then(() => {
            successNotification('');
        }, error => errorNotification(error));
    };
};

export const deleteWebRouteReset = () => ({
    type: ActionTypes.WEB_ROUTE_DELETE_RESET
});

const updateWebRouteData = (data, routeId) => ({
    type: ActionTypes.WEB_ROUTE_UPDATE,
    payload: updateData(ActionTypes.WEB_ROUTES_FETCH_URL, {}, data, routeId)
});

export const updateWebRoute = async (data, routeId) => {
    return dispatch => {
        const response = dispatch(updateWebRouteData(data, routeId));

        response.then(() => {
            successNotification('');
        }, error => errorNotification(error));
    };
};

export const updateWebRouteReset = () => ({
    type: ActionTypes.WEB_ROUTE_UPDATE_RESET
});

export const fetchCertificates = () => ({
    type: ActionTypes.CERTIFICATES_FETCH,
    payload: fetchData(ActionTypes.CERTIFICATES_FETCH_URL, {})
});

const fetchCertificateData = (id) => ({
    type: ActionTypes.CERTIFICATE_FETCH,
    payload: fetchData(ActionTypes.CERTIFICATES_FETCH_URL, {}, id)
});

export const fetchCertificate = (id) => {
    return dispatch => {
        const response = dispatch(fetchCertificateData(id));

        response.then(() => {
            successNotification('');
        }, error => errorNotification(error));
    };
};

const createCertificateData = (payload) => ({
    type: ActionTypes.CERTIFICATE_CREATE,
    payload: createData(ActionTypes.CERTIFICATES_FETCH_URL, {}, payload)
});

export const createCertificate = (payload) => {
    return dispatch => {
        const response = dispatch(createCertificateData(payload));

        response.then(() => {
            successNotification('');
        }, error => errorNotification(error));
    };
};

const deleteCertificate = (id) => ({
    type: ActionTypes.CERTIFICATE_DELETE,
    payload: deleteData(ActionTypes.CERTIFICATES_FETCH_URL, {}, id)
});

export const deleteCertificateAction = (id) => {
    return dispatch => {
        const response = dispatch(deleteCertificate(id));

        response.then(() => {
            successNotification('');
        }, error => errorNotification(error));
    };
};

export const deleteCertificateReset = () => ({
    type: ActionTypes.CERTIFICATE_DELETE_RESET
});

const updateCertificateData = (data, certificateId) => ({
    type: ActionTypes.CERTIFICATE_UPDATE,
    payload: updateData(ActionTypes.CERTIFICATES_FETCH_URL, {}, data, certificateId)
});

export const updateCertificate = async (data, certificateId) => {
    return dispatch => {
        const response = dispatch(updateCertificateData(data, certificateId));

        response.then(() => {
            successNotification('');
        }, error => errorNotification(error));
    };
};

export const updateCertificateReset = () => ({
    type: `${ActionTypes.CERTIFICATE_UPDATE}_RESET`
});
