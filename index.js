const onvif = require('../onvif/lib/onvif');
 

const cams = {}

// find the cameras with WS-Discovery (not all devices respond correctly or timely to this)
onvif.Discovery.on('device', function(cam, rinfo, xml) {
  if (cams[cam.hostname] == null) {
    console.log(`Discovered: ${cam.hostname}:${cam.port}, onvif at ${cam.path}`)
    cams[cam.hostname] = cam

    cam.username = process.env.CAM_DEFAULT_USERNAME
    cam.password = process.env.CAM_DEFAULT_PASSWORD

    cam.connect((err) => {
      if(err) {
        console.error(`Error connecting to ${cam.hostname}: ${err.message}`)
        return
      }
      console.log(`Connected to ${cam.hostname}`)
      // get capabilities
      cam.getCapabilities((err, result) => {
        if(err) {
          console.error(`Error while fetching device capabilities from ${cam.hostname}: ${err.message}`)
          return
        }
        console.log(`Capabilities for ${cam.hostname}: ${JSON.stringify(result, null, 4)}`)
      })
    })

    // get analytics info
    //cam.getAnalyticsModuleOptions()
    //cam.getAnalyticsModules()
    //cam.getSupportedAnalyticsMetadata()
    //cam.getSupportedAnalyticsRules()
    //cam.getSupportedAnalyticsModules()
    //cam.getAnalyticsRules()
    //cam.getAnalyticsRuleOptions()

  }
 })
onvif.Discovery.on('error', function(err,xml) {
   console.error('Discovery error ' + err);
});

const probeInterval = setInterval(onvif.Discovery.probe, 10000)

const exitFunc = () => {
  clearInterval(probeInterval)  
}

process.on('SIGINT', exitFunc)
process.on('SIGTERM', exitFunc)