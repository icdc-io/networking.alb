declare global {
	namespace NodeJS {
		interface ProcessEnv {
			REACT_APP_GENERAL_HOST: string;
			REACT_APP_CENTRAL_LOCATION_URL: string;
		}
	}
}

export type {};
