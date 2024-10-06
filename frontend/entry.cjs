// entry file for deployment on production server using Phusion Passenger
async function loadApp() {
  // cf. .github/workflows/deploy-common.yml
  await import('./server.js');
}

loadApp();
