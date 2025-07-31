const os = require('os');

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  
  return null;
}

const ip = getLocalIPAddress();
if (ip) {
  console.log('Your machine\'s IP address is:', ip);
  console.log('For physical device testing, update src/config/api.ts with:');
  console.log(`baseURL: 'http://${ip}:5000/api/'`);
} else {
  console.log('Could not find your machine\'s IP address');
} 