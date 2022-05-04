export const environment = {
  production: true,
  api: {
    baseUrl: 'https://localhost:7007/api',
    appVersion:'1.2.41',
    apiVersion:'1.0.0'
  },
  uploadUrl:"https://localhost:7001/fileUploader",
  userGuid:localStorage.getItem('access_token')
};
