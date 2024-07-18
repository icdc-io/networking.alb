import { returnBaseUrl } from "container/ReturnBaseUrl";

export const getPublicHostname = (user, baseUrls) => {
  const account = user?.account;
  return `${account}.alb.${returnBaseUrl(baseUrls, user.location)}`;
};
