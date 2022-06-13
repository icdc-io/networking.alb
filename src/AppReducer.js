/* eslint camelcase: 0 */
import * as ActionTypes from './AppConstants';
import Immutable from 'seamless-immutable';

// eslint-disable-next-line new-cap
const initialState = Immutable({
    traefikRoutes: [],
    traefikRoutesStatus: '',
    traefikRoute: {},
    traefikRouteStatus: '',
    traefikRouteServices: [],
    traefikRouteServicesStatus: '',
    traefikRouteDeleteStatus: '',
    traefikRouteUpdateStatus: '',
    traefikGateways: [],
    traefikGatewaysStatus: '',
    certificates: [],
    certificatesStatus: '',
    certificate: {},
    certificateStatus: '',
    certificateUpdateStatus: '',
    certificateDeleteStatus: ''
});

export const BalancerStore = (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD-BALANCER-SET-CERTIFICATE' :
            return Immutable.merge(state, {
                ...state.certificate, certificate: state.certificates[action.id - 1] });

        case `${ActionTypes.WEB_ROUTES_FETCH}_PENDING`:
            return state.set('traefikRoutesStatus', 'pending');
        case `${ActionTypes.WEB_ROUTES_FETCH}_REJECTED`:
            return state.set('traefikRoutesStatus', 'rejected');
        case `${ActionTypes.WEB_ROUTES_FETCH}_FULFILLED`:
            return Immutable.merge(state, {
                traefikRoutes: action.payload,
                traefikRoutesStatus: 'fulfilled'
            });

        case `${ActionTypes.WEB_ROUTES_SERVICES_FETCH}_PENDING`:
            return state.set('traefikRouteServicesStatus', 'pending');
        case `${ActionTypes.WEB_ROUTES_SERVICES_FETCH}_REJECTED`:
            return state.set('traefikRouteServicesStatus', 'rejected');
        case `${ActionTypes.WEB_ROUTES_SERVICES_FETCH}_FULFILLED`:
            return Immutable.merge(state, {
                traefikRouteServices: action.payload,
                traefikRouteServicesStatus: 'fulfilled'
            });

        case `${ActionTypes.WEB_ROUTE_FETCH}_PENDING`:
            return state.set('traefikRouteStatus', 'pending');
        case `${ActionTypes.WEB_ROUTE_FETCH}_REJECTED`:
            return state.set('traefikRouteStatus', 'rejected');
        case `${ActionTypes.WEB_ROUTE_FETCH}_FULFILLED`:
            return Immutable.merge(state, {
                traefikRoute: action.payload,
                traefikRouteStatus: 'fulfilled'
            });

        case  `${ActionTypes.WEB_ROUTE_DELETE}_PENDING`:
            return state.set('traefikRouteDeleteStatus', 'pending');
        case `${ActionTypes.WEB_ROUTE_DELETE}_REJECTED`:
            return state.set('traefikRouteDeleteStatus', 'rejected');
        case `${ActionTypes.WEB_ROUTE_DELETE}_FULFILLED`:
            return Immutable.merge(state, {
                traefikRouteDeleteStatus: 'fulfilled'
            });
        case ActionTypes.WEB_ROUTE_DELETE_RESET:
            return Immutable.merge(state, {
                traefikRouteDeleteStatus: ''
            });

        case  `${ActionTypes.WEB_ROUTE_CREATE}_PENDING`:
            return state.set('traefikRouteUpdateStatus', 'pending');
        case `${ActionTypes.WEB_ROUTE_CREATE}_REJECTED`:
            return state.set('traefikRouteUpdateStatus', 'rejected');
        case `${ActionTypes.WEB_ROUTE_CREATE}_FULFILLED`:
            return Immutable.merge(state, {
                traefikRouteUpdateStatus: 'fulfilled'
            });

        case  `${ActionTypes.WEB_ROUTE_UPDATE}_PENDING`:
            return state.set('traefikRouteUpdateStatus', 'pending');
        case `${ActionTypes.WEB_ROUTE_UPDATE}_REJECTED`:
            return state.set('traefikRouteUpdateStatus', 'rejected');
        case `${ActionTypes.WEB_ROUTE_UPDATE}_FULFILLED`:
            return Immutable.merge(state, {
                traefikRouteUpdateStatus: 'fulfilled'
            });
        case ActionTypes.WEB_ROUTE_UPDATE_RESET:
            return Immutable.merge(state, {
                traefikRouteUpdateStatus: ''
            });

        case `${ActionTypes.WEB_ROUTES_GATEWAYS_FETCH}_PENDING`:
            return state.set('traefikGatewaysStatus', 'pending');
        case `${ActionTypes.WEB_ROUTES_GATEWAYS_FETCH}_REJECTED`:
            return Immutable.merge(state, {
                traefikGateways: [],
                traefikGatewaysStatus: 'rejected'
            });
        case `${ActionTypes.WEB_ROUTES_GATEWAYS_FETCH}_FULFILLED`:
            return Immutable.merge(state, {
                traefikGateways: action.payload,
                traefikGatewaysStatus: 'fulfilled'
            });

        case `${ActionTypes.CERTIFICATES_FETCH}_PENDING`:
            return state.set('certificatesStatus', 'pending');
        case `${ActionTypes.CERTIFICATES_FETCH}_REJECTED`:
            return state.set('certificatesStatus', 'rejected');
        case `${ActionTypes.CERTIFICATES_FETCH}_FULFILLED`:
            return Immutable.merge(state, {
                certificates: action.payload,
                certificatesStatus: 'fulfilled'
            });

        case `${ActionTypes.CERTIFICATE_FETCH}_PENDING`:
            return state.set('certificateStatus', 'pending');
        case `${ActionTypes.CERTIFICATE_FETCH}_REJECTED`:
            return state.set('certificateStatus', 'rejected');
        case `${ActionTypes.CERTIFICATE_FETCH}_FULFILLED`:
            return Immutable.merge(state, {
                certificate: action.payload,
                certificateStatus: 'fulfilled'
            });

        case  `${ActionTypes.CERTIFICATE_CREATE}_PENDING`:
            return state.set('certificateUpdateStatus', 'pending');
        case `${ActionTypes.CERTIFICATE_CREATE}_REJECTED`:
            return state.set('certificateUpdateStatuss', 'rejected');
        case `${ActionTypes.CERTIFICATE_CREATE}_FULFILLED`:
            return Immutable.merge(state, {
                certificateUpdateStatus: 'fulfilled'
            });

        case  `${ActionTypes.CERTIFICATE_UPDATE}_PENDING`:
            return state.set('certificateUpdateStatus', 'pending');
        case `${ActionTypes.CERTIFICATE_UPDATE}_REJECTED`:
            return state.set('certificateUpdateStatuss', 'rejected');
        case `${ActionTypes.CERTIFICATE_UPDATE}_FULFILLED`:
            return Immutable.merge(state, {
                certificateUpdateStatus: 'fulfilled'
            });
        case `${ActionTypes.CERTIFICATE_UPDATE}_RESET`:
            return Immutable.merge(state, {
                certificateUpdateStatus: ''
            });

        case  `${ActionTypes.CERTIFICATE_DELETE}_PENDING`:
            return state.set('certificateDeleteStatus', 'pending');
        case `${ActionTypes.CERTIFICATE_DELETE}_REJECTED`:
            return state.set('certificateDeleteStatus', 'rejected');
        case `${ActionTypes.CERTIFICATE_DELETE}_FULFILLED`:
            return Immutable.merge(state, {
                certificateDeleteStatus: 'fulfilled'
            });
        case ActionTypes.CERTIFICATE_DELETE_RESET:
            return Immutable.merge(state, {
                certificateDeleteStatus: ''
            });

        default:
            return Immutable.merge(state, {});
    }
};
