const env = window._ENV || process.env;

export const SERVER_API_URL = env.REACT_APP_SERVER_API_URL || '';
export const USE_MSW = env.REACT_APP_USE_MSW || '';
