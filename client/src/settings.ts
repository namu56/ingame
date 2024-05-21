const { REACT_APP_SERVER_API_URL: SERVER_API_URL = '' } = window._ENV ?? process.env;

export { SERVER_API_URL };
