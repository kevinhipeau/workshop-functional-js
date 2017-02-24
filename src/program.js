let chalk = require('chalk');
var _ = require('lodash');
let checkpointsService = require('./staticCheckpoints');


let calculateDistanceWithRssi = rssi => {
  var txPower = -59; // hard coded power value. Usually ranges between -59 to -65
  if (rssi == 0) {
    return -1.0;
  }
  var ratio = rssi * 1.0 / txPower;
  if (ratio < 1.0) {
    return Math.pow(ratio,10);
  } else {
    var distance = (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
    return distance;
  }
};
function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}
let transformCheckpoint = (checkpoint) => {
  var checkpoint = clone(checkpoint);
  if (checkpoint) {
    // Get back essential properties
    checkpoint.serviceData = checkpoint.advertisement.serviceData;
    checkpoint.serviceUuids = checkpoint.advertisement.serviceUuids;
    // Transform data about distance
    checkpoint.distance = calculateDistanceWithRssi(checkpoint.rssi);
    // Clean uninteresting properties
    delete checkpoint.id;
    delete checkpoint.address;
    delete checkpoint.addressType;
    delete checkpoint.advertisement;
    delete checkpoint.rssi;
    delete checkpoint.services;
    // Everything is ok
    return checkpoint;
  } else {
    return false;
  }
};

let showCheckpoint = (checkpoint, index) => {
  console.log(chalk.green('CHECKPOINT'), chalk.yellow(index + 1));
   var list = _.sortBy(checkpoint, function(o) {
    return o.distance; 
  });

  var pick = _.pickBy(checkpoint,function(item,key){
    return checkpoint.hasOwnProperty(key) && item != null;
  });

  _.mapKeys(pick,function(item,key){
    if (key == "distance") {
      if (item < 1) {
        item = item *100 + " cm";
      }else{
        item = item + " km";
      }
    };
    console.log(chalk.cyan(key.toUpperCase()), item);
    return item
  })

  console.log('\n');
};

let run = () => {
  let checkpoints = checkpointsService.getCheckpoints();

  checkpoints.forEach(function(item,index) {
    let checkpoint = item;
    showCheckpoint(transformCheckpoint(checkpoint), index);
  })

};

module.exports = {
  transformCheckpoint: transformCheckpoint,
  showCheckpoint: showCheckpoint,
  run: run
};