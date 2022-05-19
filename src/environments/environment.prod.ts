export const environment = {
  production: true,
  api: {
    baseUrl: 'https://api.iraniexpert.com/api',
    appVersion:'1.2.41',
    apiVersion:'1.0.0'
  },
  uploadUrl:"https://demo.iraniExpert.com/fileUploader",
  jwtToken:localStorage.getItem('jwtToken') ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidmFoaWRBaG1hZGkiLCJyb2xlIjoiQWRtaW5pc3RyYXRvciIsIm5iZiI6MTY1MTg1MzY4MCwiZXhwIjoxNjUzMDYzMjgwLCJpYXQiOjE2NTE4NTM2ODAsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjYwMDEvIn0.1kOxLOvfVW0VO9QdhWVfaJ-44fCbkjEWGFuCY9GR_Ic"
};
