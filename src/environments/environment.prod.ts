export const environment = {
  production: true,
  api: {
    baseUrl: 'https://dev.iraniexpert.com/api',
    appVersion: '1.2.41',
    apiVersion: '1.0.0',
  },
  uploadUrl: 'https://dl.iraniexpert.com/fileUploader',
  jwtToken: localStorage.getItem('token')
    ? localStorage.getItem('token')
    : 'anonymous',
};
