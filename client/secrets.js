const secrets = {
  PORT: 3000, // process.env.PORT || 3000,
  BACKEND_URL: 'http://localhost:3000',
  MAPBOX_TOKEN: 'your-mapbox-token-here',
  clientId: '***', // REDACTED, UPDATED BEFORE USE
  FEATURE_FLAGS: {
    enableScheduling: true,
    showBetaUI: false,
  },
};

export default secrets;