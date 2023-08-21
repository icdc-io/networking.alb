export const getPublicHostname = (user, vendor) => {
  const location = user?.location;
  const account = user?.account;
  return ((location === 'xby') || (location === 'zby')) ? `${account}.alb.${location}.scdc.io` : `${account}.alb.${location}.${vendor}.io`
} 
