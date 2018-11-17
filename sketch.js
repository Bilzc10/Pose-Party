// Parse URL and modify variables based on url parameters
var url = new URL(window.location.href);

var showDataPoints = config.ignoreUrlParameters ? config.showDataPointsDefault : (url.searchParams.get("showDataPoints") != null || config.showDataPointsDefault); // ?showDataPoints
var faceUser = config.ignoreUrlParameters ? config.faceUserDefault : (url.searchParams.get("faceEnvironment") == null && config.faceUserDefault); // ?faceEnvironment
var multi = url.searchParams.get("multi") != null || url.searchParams.get("multiPose") != null ;
var single = url.searchParams.get("single") != null || url.searchParams.get("singlePose") != null ;
var singlePose = ((single && multi) || (!single && !multi) || config.ignoreUrlParameters) ? config.singlePoseDetection : single;
console.log(config.zones);
var zone = (Object.keys(config.zones).find(function(e) {return e == url.searchParams.get("zone")})) ? url.searchParams.get("zone") : "default";

var zones = {};
var detects = {};

var zones = {};

config.zones[zone].forEach(function(item, index) {
  let width = Math.abs(item.coords[0][0] - item.coords[1][0]);
  let height = Math.abs(item.coords[0][1] - item.coords[1][1]);
  for (var i1 = 0; i1 < 2; i1++) {
    for (var i2 = 0; i2 < 2; i2++) {
      if (item.coords[i1][i2] < 0) {
        let coord = item.coords[i1][i2];
         coord = (i2 == 1) ? height - coord : width - coord;
      }
    }
  }
  let x = Math.min(item.coords[0][0], item.coords[1][0]);
  let y = Math.min(item.coords[0][1], item.coords[1][1]);
  zones[item.name] = {
    x: x,
    y: y,
    w: width,
    h: height
  }
});

// Detect OS and if it's mobile
function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
  return isAndroid() || isiOS();
}

const mobile = config.ignoreUrlParameters ? isMobile() : (url.searchParams.get("desktop") != null ? false : (isMobile() || url.searchParams.get("mobile") != null));

var canvas;
var ctx;
var ready;

let poseNet;
let poses = [];

var useVideo = true;
var useAudio = false;

var draw = function() {
  image(video, 0, 0, width, height);
}

function setup() { // Setup PoseNet
  createCanvas(640, 480);

  // Functions stolen from poseNet because it didnt allow the amount of control I wanted
  function addElement(elt, pInst, media) {
    var node = pInst._userNode ? pInst._userNode : document.body;
    node.appendChild(elt);
    var c = media ? new p5.MediaElement(elt) : new p5.Element(elt);
    pInst._elements.push(c);
    return c;
  }

  // function createCapture() from poseNet
  //p5._validateParameters('createCapture', arguments);
  var constraints;
  if (navigator.getUserMedia) {
    var elt = document.createElement('video');

    if (!constraints) {
      constraints = {video: {facingMode: faceUser ? 'user' : 'environment'}, audio: false};
    }

    navigator.mediaDevices.getUserMedia(constraints).then(
      function(stream) {
        try {
          if ('srcObject' in elt) {
            elt.srcObject = stream;
          } else {
            elt.src = window.URL.createObjectURL(stream);
          }
        } catch (err) {
          elt.src = stream;
        }
      },
      function(e) {
        console.log(e);
      }
    );
  } else {
    let error = "getUserMedia not supported in this browser";
    document.getElementById("error").innerHTML = error
    document.getElementById("error").style.display = "inline";
    throw error;
  }
  var c = addElement(elt, this, true);
  c.loadedmetadata = false;
  // set width and height onload metadata
  elt.addEventListener('loadedmetadata', function() {
    elt.play();
    if (elt.width) {
      c.width = elt.videoWidth = elt.width;
      c.height = elt.videoHeight = elt.height;
    } else {
      c.width = c.elt.width = elt.videoWidth;
      c.height = c.elt.height = elt.videoHeight;
    }
    c.loadedmetadata = true;
  });
  video = c;

  video.size(width, height);
  console.log(singlePose);
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, {imageScaleFactor: config.advanced.imageScaleFactor, outputStride: config.advanced.outputStride, flipHorizontal: config.advanced.flipHorizontal, minConfidence: config.advanced.minConfidence, maxPoseDetections: config.advanced.maxPoseDetections, scoreThreshold: config.advanced.scoreThreshold, nmsRadius: config.advanced.nmsRadius, detectionType: (singlePose ? 'single' : 'multiple'), multiplier: isMobile() ? config.advanced.multiplierDefault : config.advanced.multiplierDefaultMobile}, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  canvas = document.getElementsByTagName("canvas")[0];
  ctx = canvas.getContext("2d");

  config.zones[zone].forEach(function(item, index) {
    for (var i1 = 0; i1 < 2; i1++) {
      for (var i2 = 0; i2 < 2; i2++) {
        let coord = item.coords[i1][i2];
        if (1/coord < 0) { // Check if number is snegative including neg zero
          if (i2 == 1) item.coords[i1][i2] = canvas.height + coord;
          else item.coords[i1][i2] = canvas.width + coord;
        }
      }
    }
    let zwidth = Math.abs(item.coords[0][0] - item.coords[1][0]);
    let zheight = Math.abs(item.coords[0][1] - item.coords[1][1]);
    let x = Math.min(item.coords[0][0], item.coords[1][0]);
    let y = Math.min(item.coords[0][1], item.coords[1][1]);
    zones[item.name] = {
      x: x,
      y: y,
      x2: x + zwidth,
      y2: y + zheight,
      w: zwidth,
      h: zheight,
      active: false,
      detects: item.detect,
      start: item.start,
      stop: item.stop,
      trigger: item.trigger,
      type: item.type
    }
  });

  for (zone in zones) {
    zones[zone].detects.forEach(function(item, index) {
      if (detects[item]) detects[item].push(zone);
      else detects[item] = [zone];
    });
  }

  if (config.flipFrontCam && faceUser) {
    draw = function() {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);

      image(video, 0, 0, width, height);

      // We can call both functions to draw all keypoints and the skeletons
      drawKeypoints();
      drawSkeleton();

      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      drawZones();
      detectZoneCollision();
    }
  } else {
    draw = function() {
      image(video, 0, 0, width, height);

      // We can call both functions to draw all keypoints and the skeletons
      drawKeypoints();
      drawSkeleton();
      drawZones();
      detectZoneCollision();
    }
  }

  if (showDataPoints) {
    let pre = document.createElement("pre");
    pre.id = "points";
    pre.style.display = "block";
    document.getElementsByTagName("body")[0].appendChild(pre);
  }

  document.getElementById("status").style.display = "none";

  canvas.classList.add("canvasMain");

  /* if (config.flipFrontCam && faceUser)
    canvas.classList.add("flip180");
  else
    canvas.classList.remove("flip180"); */
}



// A function to draw ellipses over the detected keypoints
function drawKeypoints(color)  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    if (showDataPoints) {
      document.getElementById("points").innerHTML = syntaxHighlight(JSON.stringify(poses, null, 2)); // Print poses array if needed
      var elements = document.getElementsByClassName("number");
      for (var e = 0; e < elements.length; e++) {
        let num = parseFloat(elements[e].innerHTML);
        if (num >= config.advanced.minConfidence && num < 1) elements[e].classList.add("confident");
      }
    }
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        ctx.fillStyle = (color) ? color : config.keypointColor;
        fill(255, 255, 255);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton(color) {
  ctx.strokeStyle = (color) ? color : config.skeletonColor;
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 255, 255);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

function drawZones(color) {
  if (!color) color = config.zoneColor;
  for (zone in zones) {
    drawZone(zone, color)
  }
}

function drawZone(zone, color, fill) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  if (!fill) ctx.strokeRect(zones[zone].x, zones[zone].y, zones[zone].w, zones[zone].h);
  else ctx.fillRect(zones[zone].x, zones[zone].y, zones[zone].w, zones[zone].h);
  ctx.font="15px Arial";
  ctx.textAlign="center";
  ctx.fillText(zone, (zones[zone].x + zones[zone].w / 2), (zones[zone].y + zones[zone].h / 2));
}

function detectZoneCollision() {
  if (poses[0]) {
    // Multiple poses cause issues, only take the first pose in the array for this one
    let pose = poses[0].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > config.advanced.minConfidence) {
        for (part in detects) {
          if (keypoint.part == part) {
            detects[part].forEach(function(item, index) {
              let x = (config.flipFrontCam && faceUser) ? canvas.width - keypoint.position.x : keypoint.position.x;
              if (zones[item].x < x && x < zones[item].x2 && zones[item].y < keypoint.position.y && keypoint.position.y < zones[item].y2) {
                console.log(zones[item].type);
                if (zones[item].type == 'left') drawZone(item, song.leftColor, true);
                else drawZone(item, song.rightColor, true);
                zones[item].trigger();
                if (!zones[item].active) {
                  zones[item].active = true;
                  zones[item].start();
                }
              } else if (zones[item].active) {
                zones[item].active = false;
                zones[item].stop();
              }
            });
          }
        }
      }
    }
  }
}
