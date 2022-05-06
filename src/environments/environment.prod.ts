export const environment = {
  production: true,
  api: {
    baseUrl: 'https://localhost:6001/api',
    appVersion:'1.2.41',
    apiVersion:'1.0.0'
  },
  uploadUrl:"https://localhost:7001/fileUploader",
  jwtToken:localStorage.getItem('jwtToken') ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoieWFzZXIiLCJyb2xlIjoiQWRtaW5pc3RyYXRvciIsIm5iZiI6MTY1MTgyODgyNSwiZXhwIjoxNjUzMDM4NDI0LCJpYXQiOjE2NTE4Mjg4MjUsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjYwMDEifQ.CkdzLIg49a14hCUQtUK2RKEw-5USacpc8hsSYgftMoU"
};
