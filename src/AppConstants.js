export const WEB_ROUTES_FETCH = 'WEB_ROUTES_FETCH';
export const WEB_ROUTE_FETCH = 'WEB_ROUTE_FETCH';
export const WEB_ROUTES_SERVICES_FETCH = 'WEB_ROUTES_SERVICES_FETCH';
export const WEB_ROUTES_FETCH_URL = `/routes`;
export const WEB_ROUTES_SERVICES_FETCH_URL = `/services`;
export const WEB_ROUTE_DELETE = 'WEB_ROUTE_DELETE';
export const WEB_ROUTE_DELETE_RESET = 'WEB_ROUTE_DELETE_RESET';
export const WEB_ROUTE_CREATE = 'WEB_ROUTE_CREATE';
export const WEB_ROUTE_UPDATE = 'WEB_ROUTE_UPDATE';
export const WEB_ROUTE_UPDATE_RESET = 'WEB_ROUTE_UPDATE_RESET';
export const webRouteUrl = (id) => `/routes/${id}`;

export const CERTIFICATES_FETCH = 'CERTIFICATES__FETCH';
export const CERTIFICATE_FETCH = 'CERTIFICATE__FETCH';
export const CERTIFICATE_DELETE_RESET = 'CERTIFICATE_DELETE_RESET';
export const CERTIFICATES_FETCH_URL = `/certificates`;
export const CERTIFICATE_DELETE = 'CERTIFICATES__DELETE';
export const CERTIFICATE_CREATE = 'CERTIFICATES__CREATE';
export const CERTIFICATE_UPDATE = 'CERTIFICATE_UPDATE';
export const certificateUrl = (id) => `/certificates/${id}`;

export const notificationMessages = {
    ru: {
        error: 'Ошибка! ',
        success: 'Успешно! ',
        sgNotExist: 'Группы безопасности с таким ID не существует',
        ruleEditError: 'Ошибка при редактировании правила',
        routerNotExist: 'Сетевого маршрутизатора с таким ID не существует',
        unauthorized: 'Пользователь не авторизирован',
        // removalProcessStarted: 'Процесс удаления запущен',
        cannotDeleteGroupWithAssignedVmsNics: `Невозможно удалить группу безопасности с назначенными NICs`,
        ruleAlreadyExists: 'Правило уже существует'
    },
    en: {
        error: 'Error! ',
        success: 'Success! ',
        sgNotExist: 'Could not find Security group with such ID',
        ruleEditError: 'Firewall rule edit error',
        routerNotExist: 'Could not find Network router with such ID',
        unauthorized: 'Unauthorized',
        cannotDeleteGroupWithAssignedVmsNics: `Can't delete security group with assigned NICs`,
        // removalProcessStarted: 'The deletion process has started',
        ruleAlreadyExists: 'Rule already exists'
    }
};
