/****************
 **** Config ****
 ****************
 Change any json values here to change how the application works */

var config = {
  faceUserDefault: true,
  /* faceUserDefault
   * true (default) - the front-facing camera is used if available, but the rear camera can be enabled through the rearCamera url parameter
   * false - the rear-facing camera is used if available regardless of the rearCamera url parameter */
  enforceCameraDirection: false,
  /* enforceCameraDirection
   * true - The camera defined in faceUserDefault must be used, if unavailable, the video stream will be unavailable
   * false (default) - The browser will fall back to a different camera if the camera defined in faceUserDefault is unavailable */
  flipFrontCam: true,
  /* flipFrontCam
   * true (default) - The camera view is flipped/mirrored when using the front facing camera
   * false - the camera view is normal */
  singlePoseDetection: true,
  /* singlePoseDetection
   * true - Faster and more accurate but only one person can be in frame
   * false (default) - Slower, but multiple people can be in the frame */
  showDataPointsDefault: false,
  /* showDataPointsDefault
   * true - Data points are shown regardless of the showPoints url parameter
   * false (default) - Data points are disabled by default but can be enabled through the showPoints url parameter */
  ignoreUrlParameters: false,
  /* ignoreUrlParameters
   * true - URL parameters are ignored and cannot modify the function of the program
   * false (default) - URL parameters are allowed to modify the function of the program */

  /* Zones - Defines zones for detection
   * name - string, MUST BE UNIQUE
   * type - 'right' (left colpr), right (right color)
   * coords - The 2 coordinates for defining the shape of the zone. Positive coordinates are measured from origin, negative are measured from opposite origin.
   * detect - array, all parts that should set off a collision
   * * * Possible Values: "nose", "leftEye", "rightEye", "leftEar", "rightEar", "leftShoulder", "rightShoulder", "leftElbow", "rightElbow", "leftWrist", "rightWrist", "leftHip", "rightHip", "leftKnee", "rightKnee", "leftAnkle", "rightAnkle"
   * trigger - function, action to perform eevry tick that a detected part is in the box
   * start - function, action to perform when a detected part enters the box
   * stop - function, action to perform when a detected part leaves the box */
  zones: {
    default: [ // The default zone configuration.
      {
        name: 0, //'TopLeftRight',
        type: 'left',
        coords: [
          [0, 0],
          [100, 100]
        ],
        detect: ["rightWrist"],
        trigger: function() {},
        start: function() {},
        stop: function() {}
      }, {
        name: 1, //'TopCenterRight',
        type: 'left',
        coords: [
          [190, 0],
          [290, 100]
        ],
        detect: ["rightWrist"],
        trigger: function() {},
        start: function() {},
        stop: function() {}
      }, {
        name: 2, //'TopRightRight',
        type: 'left',
        coords: [
          [-160, 0],
          [-260, 100]
        ],
        detect: ["rightWrist"],
        trigger: function() {},
        start: function() {},
        stop: function() {}
      }, {
        name: 3, //'MiddleRightRight',
        type: 'left',
        coords: [
          [-160, 190],
          [-260, 290]
        ],
        detect: ["rightWrist"],
        trigger: function() {},
        start: function() {},
        stop: function() {}
      }, {
        name: 4, //'BottomRightRight',
        type: 'left',
        coords: [
          [-160, -0],
          [-260, -100]
        ],
        detect: ["rightWrist"],
        trigger: function() {},
        start: function() {},
        stop: function() {}
      }, {
        name: 5, //'BottomCenterRight',
        type: 'left',
        coords: [
          [190, -0],
          [290, -100]
        ],
        detect: ["rightWrist"],
        trigger: function() {},
        start: function() {},
        stop: function() {}
      }, {
        name: 6, //'BottomLeftRight',
        type: 'left',
        coords: [
          [0, -0],
          [100, -100]
        ],
        detect: ["rightWrist"],
        trigger: function() {},
        start: function() {},
        stop: function() {}
      }, {
        name: 7, //'MiddleLeftRight',
        type: 'left',
        coords: [
          [0, 190],
          [100, 290]
        ],
        detect: ["rightWrist"],
        trigger: function() {},
        start: function() {},
        stop: function() {}
      }, {
        name: 8,
        type: 'right',
        coords: [
          [0, 0],
          [100, 100]
        ],
        detect: ["leftWrist"],
        trigger: function() {},
        start: function() {},
        stop: function() {}
      }, {
        name: 9,
        type: 'right',
        coords: [
          [190, 0],
          [290, 100]
        ],
        detect: ["leftWrist"],
        trigger: function() {},
        start: function() {},
        stop: function() {}
      }, {
        name: 10,
        type: 'right',
        coords: [
          [-160, 0],
          [-260, 100]
        ],
        detect: ["leftWrist"],
        trigger: function() {},
        start: function() {},
        stop: function() {}
      }, {
        name: 11,
        type: 'right',
        coords: [
          [-160, 190],
          [-260, 290]
        ],
        detect: ["leftWrist"],
        trigger: function() {},
        start: function() {},
        stop: function() {}
      }, {
        name: 12,
        type: 'right',
        coords: [
          [-160, -0],
          [-260, -100]
        ],
        detect: ["leftWrist"],
        trigger: function() {},
        start: function() {},
        stop: function() {}
      }, {
        name: 13,
        type: 'right',
        coords: [
          [190, -0],
          [290, -100]
        ],
        detect: ["leftWrist"],
        trigger: function() {},
        start: function() {},
        stop: function() {}
      }, {
        name: 14,
        type: 'right',
        coords: [
          [0, -0],
          [100, -100]
        ],
        detect: ["leftWrist"],
        trigger: function() {},
        start: function() {},
        stop: function() {}
      }, {
        name: 15,
        type: 'right',
        coords: [
          [0, 190],
          [100, 290]
        ],
        detect: ["leftWrist"],
        trigger: function() {},
        start: function() {},
        stop: function() {}
      }
    ],
    alternate: []
  },
  keypointColor: "#ffffff", // Default color keypoints are drawn in. Default: #ffffff (white)
  skeletonColor: "#ffffff", // Default color the skeleton is drawn in. Default: #ffffff (white)
  zoneColor: "#ffffff", // Default color zones are drawn in. Default: #ffffff (white)

  // Advanced settings - See PoseNet readme for more details: https://github.com/tensorflow/tfjs-models/tree/master/posenet
  advanced: {
    imageScaleFactor: 0.5, // A number between 0.2 and 1.0. Defaults to 0.50. What to scale the image by before feeding it through the network. Set this number lower to scale down the image and increase the speed when feeding through the network at the cost of accuracy.
    outputStride: 16, // the desired stride for the outputs when feeding the image through the model. Must be 32, 16, 8. Defaults to 16. The higher the number, the faster the performance but slower the accuracy, and visa versa.
    flipHorizontal: false, // Defaults to false. If the poses should be flipped/mirrored horizontally. This should be set to true for videos where the video is by default flipped horizontally (i.e. a webcam), and you want the poses to be returned in the proper orientation. **THIS FLIPS THE POSE NOT THE WEBCAM FEED, USE flipFrontCam TO FLIP BOTH**
    minConfidence: 0.1, // Minimum confidence of each part to be displayed
    maxPoseDetections: 1, // the maximum number of poses to detect. Defaults to 5.
    scoreThreshold: 0.5, // Only return instance detections that have root part score greater or equal to this value. Defaults to 0.5.
    nmsRadius: 40, // Non-maximum suppression part distance. It needs to be strictly positive. Two parts suppress each other if they are less than nmsRadius pixels away. Defaults to 20.
    /* multiplier
     * An optional number with values: 1.01, 1.0, 0.75, or 0.50.
     * Defaults to 1.01. It is the float multiplier for the depth (number of channels) for all convolution operations. The value corresponds to a MobileNet architecture and checkpoint.
     * The larger the value, the larger the size of the layers, and more accurate the model at the cost of speed. Set this to a smaller value to increase speed at the cost of accuracy. */
    multiplierDefault: 0.75, // Multiplier for non-mobile devices
    multiplierDefaultMobile: 0.75, // Multiplier for mobile devices
  }
}
