const secrets = {
  PORT: 3000, // process.env.PORT || 3000,
  BACKEND_URL: 'http://localhost:3000',
  MAPBOX_TOKEN: 'your-mapbox-token-here',
  clientId: '539152497200-qgajpt09gnlgolmik3duohq8lrhv4sqs.apps.googleusercontent.com',
  FEATURE_FLAGS: {
    enableScheduling: true,
    showBetaUI: false,
  },
};

export default secrets;