import { returnBaseUrl } from "container/ReturnBaseUrl";
import type { User } from "container/compiled-types/src/types/entities";

type BaseUrlsType = Record<string, string> | null;

export const getPublicHostname = (user: User, baseUrls: BaseUrlsType) => {
	const account = user?.account;
	return `${account}.alb.${returnBaseUrl(baseUrls, user.location)}`;
};
