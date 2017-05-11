'use strict';

var mongoose = require('mongoose'),
  _ = require('lodash'),
  Sound = mongoose.model('Sounds');

var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);

exports.list_all_sounds = function (req, res) {
  Sound.find({}, function (err, sound) {
    if (err)
      res.send(err);
    res.json(sound);
  });
};


exports.add_new_sound = function (req, res) {
  var new_sound = new Sound(req.body);
  new_sound.save(function (err, sound) {
    if (err)
      console.log('big error');
      res.send(err);

    res.json(sound);
  });
};


exports.read_a_sound = function (req, res) {
  Sound.findById(req.params.soundId, function (err, sound) {
    if (err)
      res.send(err);
    res.json(sound);
  });
};


exports.update_a_sound = function (req, res) {
  Sound.findOneAndUpdate(req.params.soundId, req.body, { new: true }, function (err, sound) {
    if (err)
      res.send(err);
    res.json(sound);
  });
};


exports.delete_a_sound = function (req, res) {
  Sound.remove({
    _id: req.params.soundId
  }, function (err, sound) {
    if (err)
      res.send(err);
    res.json({ message: 'Sound successfully deleted' });
  });
};
