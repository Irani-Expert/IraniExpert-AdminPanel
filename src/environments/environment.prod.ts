export const environment = {
  production: true,
  api: {
    baseUrl: 'https://api.iraniexpert.com/api',
    appVersion: '1.2.41',
    apiVersion: '1.0.0',
  },
  uploadUrl: 'https://dl.iraniexpert.com/api/Files/Upload',
  ckEditorUploadUrl: 'https://dl.iraniexpert.com/api/Files/UploadCKEditor',
  jwtToken: localStorage.getItem('token')
    ? localStorage.getItem('token')
    : 'anonymous',
};
