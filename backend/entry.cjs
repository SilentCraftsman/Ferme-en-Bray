// entry file for deployment on production server using Phusion Passenger
async function loadApp() {
  await import('./src/app.js');
}

loadApp();
