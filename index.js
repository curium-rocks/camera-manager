const onvif = require('onvif');
 

const cams = {}

onvif.Discovery.on('device', function(cam, rinfo, xml) {
  if (!cams[cam.hostname]) {
    console.log(`Discovered: ${cam.hostname}:${cam.port}, onvif at ${cam.path}`)
    cams[cam.hostname] = new Cam({
      hostname: cam.hostname,
      username: process.env.DEFAULT_CAM_USERNAME,
      password: process.env.DEFAULT_CAM_PASSWORD,
      port: cam.port,
      timeout: 10000,
      preserveAddress: true
    }, () => {
      console.log('Connected')
    })
  }
 })
onvif.Discovery.on('error', function(err,xml) {
   console.error('Discovery error ' + err);
});
const probeInterval = setInterval(onvif.Discovery.probe, 10000)