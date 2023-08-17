export const getPublicHostname = (user) => {
  const location = user?.location.toLowerCase();
  const account = user?.account.toLowerCase();
  return ['xby', 'zby'].includes(location) ? `${account}.alb.${location}.scdc.io` : `${account}.alb.${location}.icdc.io`
};
