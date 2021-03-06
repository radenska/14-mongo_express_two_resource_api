'use strict';

const debug = require('debug')('peak:mountains');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Peak = require('./peak.js');

const mountainsSchema = Schema({
  name: { type: String, required: true },
  timestamp: { type: Date, required: true },
  peaks: [{ type: Schema.Types.ObjectId, ref: 'peak' }]
});

const Mountains = module.exports = mongoose.model('mountains', mountainsSchema);

Mountains.findByIdAndAddPeak = function(id, peak, next) { //static method that takes in a peak and its ID and puts it in the peak Mountains property
  debug('findByIdAndAddPeak');
  return Mountains.findById(id)
    .then(mountains => {
      peak.mountainsID = mountains._id;
      this.tempMountains = mountains;
      return new Peak(peak).save(); //make new peak from variable passed into funciton and save in db peak collection
    })
    .then(peak => {
      this.tempMountains.peaks.push(peak._id); // puts the peak ID into array in Mountains
      this.tempPeak = peak; //saves a temp copy of the peak
      return this.tempMountains.save(); //database updated with new peak info!
    })
    .then( () => { return this.tempPeak; } ) //returns peak value to original function
    .catch(next);
};
