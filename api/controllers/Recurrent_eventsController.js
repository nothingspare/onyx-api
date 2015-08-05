/**
 * Recurrent_eventsController
 *
 * @description :: Server-side logic for managing recurrent_events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `Recurrent_eventsController.add()`
   */
  add: function (req, res) {
  	if (req.body.location_id && req.body.start_hour && req.body.end_hour) {
		Recurrent_events.create(req.body).exec(function (error, change) {
			res.json(change);
		});
	}
  },


  /**
   * `Recurrent_eventsController.index()`
   */
  index: function (req, res) {
	Recurrent_events.find(req.body)
		.populate('sunday_user_id')
		.populate('monday_user_id')
		.populate('tuesday_user_id')
		.populate('wednesday_user_id')
		.populate('thursday_user_id')
		.populate('friday_user_id')
		.populate('saturday_user_id')
		.populate('events')
		.exec(function (error, rows) {
			if (!error) {
				res.json(rows);
			}
			else {
				console.log(error);
			}
		});
  },


  /**
   * `Recurrent_eventsController.read()`
   */
  read: function (req, res) {
	Recurrent_events.find(req.body).exec(function (error, found) {
		res.json(found);
	});
  },


  /**
   * `Recurrent_eventsController.edit()`
   */
  edit: function (req, res) {
  	console.log(req.body);
	Recurrent_events.update({id: req.body.id}, req.body).exec(function (error, change) {
		console.log(error);
		res.json(change);
	});
  },


  /**
   * `Recurrent_eventsController.archive()`
   */
  archive: function (req, res) {
    return res.json({
      todo: 'archive() is not implemented yet!'
    });
  }
};

