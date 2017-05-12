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

  var already_exists = true;

  var part = req.files.file;
  var name = req.body.name;

  gfs.exist({
    filename: name
  }, function (err, found) {
    if (err) return handleError(err);
    if (found) {
      console.log('File named ' + name + ' already exists. Overwriting it.');
      gfs.remove({
        filename: 'a'
      }, function (err) {
        if (err) return handleError(err);
        console.log('Successfully deleted the old file');
        var writeStream = gfs.createWriteStream({
          filename: name,
          mode: 'w',
          content_type: part.mimetype
        });

        console.log('Saving file');
        writeStream.on('close', function (file) {
          console.log('File ' + file.filename + ' saved successfully');
        });

        writeStream.write(part.data);
        writeStream.end();

        if (!already_exists) {
          var new_sound = new Sound(req.body);
          new_sound.save(function (err, sound) {
            if (err) {
              res.send(err);
            }
            res.json(sound);
          });
        }
      });
    } else {
      already_exists = false;
      console.log('File named ' + name + ' does not exist. Creating it now.');
      var writeStream = gfs.createWriteStream({
        filename: name,
        mode: 'w',
        content_type: part.mimetype
      });

      console.log('Saving file');
      writeStream.on('close', function (file) {
        console.log('File ' + file.filename + ' saved successfully');
      });

      writeStream.write(part.data);
      writeStream.end();


      if (!already_exists) {
        var new_sound = new Sound(req.body);
        new_sound.save(function (err, sound) {
          if (err) {
            res.send(err);
          }
          res.json(sound);
        });
      }
    }


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

    console.log(req.params.soundId);
    console.log(req.params.fileId);

    gfs.exist({
      filename: 'a'
    }, function (err, found) {
      if (err) return handleError(err);
      found ? console.log('File exists') : console.log('File does not exist');
      gfs.remove({
        filename: 'a'
      }, function (err) {
        if (err) return handleError(err);
        console.log('success');
        gfs.exist({
          filename: 'a'
        }, function (err, found2) {
          if (err) return handleError(err);
          found2 ? console.log('File exists') : console.log('File does not exist');
        });
      });
    });
    /*
  gfs.files.find().toArray(function (err, files) {
 
    if (files.length === 0) {
      console.log('did not found any');
    } else {
      console.log('before found: ' + files.length);
      console.log('file ' + files[0]._id);
      console.log('filename ' + files[0].filename);
      gfs.remove({ _id: files[0]._id });
      gfs.files.find().toArray(function (err, files) {
        console.log('after found: ' + files.length);
      });
    }
 
  });*/

    res.json({ message: 'Sound successfully deleted' });
  });
};
