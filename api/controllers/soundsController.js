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
    if (err) {
      res.send(err);
    }

    console.log(req.files);

    var part = req.files.file;

    var writeStream = gfs.createWriteStream({
      filename: part.name,
      mode: 'w',
      content_type: part.mimetype
    });

    console.log('saving');
    writeStream.on('close', function () {
      console.log('file saved successfully');
      // return res.status(200).send({
      //  message: 'Success'
      //});
    });

    writeStream.write(part.data);

    writeStream.end();

    res.json(sound);
  });
};


exports.read_a_sound = function (req, res) {

    console.log(req.params);
    gfs.files.find({ filename: req.params.soundId }).toArray(function (err, files) {

      if (files.length === 0) {
        return res.status(400).send({
          message: 'File not found'
        });
      }

      res.writeHead(200, { 'Content-Type': files[0].contentType });

      var readstream = gfs.createReadStream({
        filename: files[0].filename
      });

      readstream.on('data', function (data) {
        console.log(data);
        res.write(data);
      });

      readstream.on('end', function () {
        console.log('end');
        res.end();
      });

      readstream.on('error', function (err) {
        console.log('An error occurred!', err);
        throw err;
      });

    });

    // res.json('succeeeded?');

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
