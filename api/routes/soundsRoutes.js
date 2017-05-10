'use strict';
module.exports = function(app) {
  var sounds = require('../controllers/soundsController');


  // sounds Routes
  app.route('/sounds')
    .get(sounds.list_all_sounds)
    .post(sounds.add_new_sound);


  app.route('/sounds/:soundId')
    .get(sounds.read_a_sound)
    .put(sounds.update_a_sound)
    .delete(sounds.delete_a_sound);
};