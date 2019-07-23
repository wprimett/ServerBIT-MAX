Currently MacOS only

### Installation and Startup
- To run as a standalone application, simply launch (Right-click & Open) the application to start
- To edit the patch, please clone/download this repository and start from *ServerBIT_PATCH.maxpat*. You will need a copy of MAX/MSP and the labraries listed below

### Dependencies
- CNMAT  Externals (Available in the MAX package manger): https://cnmat.berkeley.edu/downloads
- BITalino MAX Object: https://github.com/Ircam-RnD/bitalino-max
- IRCAM R-IOT MAX Object: https://github.com/Ircam-R-IoT/motion-analysis-max
- Max Worldmaking Package (for WebSockets) https://github.com/worldmaking/Max_Worldmaking_Package

### Instructions
#### #1 Connect a new device
**BITalino**

Device must be switched on and already paired with the computer (make sure bluetooth is enabled).

![ServerBIT_MAX-0](https://user-images.githubusercontent.com/9369774/61723051-4c00d000-ad63-11e9-9ec9-4015c4236a1c.gif)

**R-IoT**

You must be connected to the same wireless network as the R-IoT. From here, the IP has to match the OSC destination address. For assistance, go to the `wifi_network_osx` tab.

#### #2 Choose a network protocol and begin data acquisition
Go the the `data_output` tab and select either OSC or Websockets. You can then edit the chanel mask, label and output destination and click the *Start Acquisition* toggle to begin streaming. You should start seeing the JSON output below.

![ServerBIT_MAX-1](https://user-images.githubusercontent.com/9369774/61723057-4efbc080-ad63-11e9-972c-e9c20910cf1d.gif)
