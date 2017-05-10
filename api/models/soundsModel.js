'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SoundSchema = new Schema({
  name: {
    type: String,
    Required: 'Please enter the name of the sound'
  },
  sound: {
    type: String,
    Required: 'Please upload the sound file'
  },
  cate_created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Sounds', SoundSchema);