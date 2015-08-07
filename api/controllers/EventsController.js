/**
 * EventsController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `EventsController.index()`
   */
  index: function (req, res) {
  	Events.find(req.body).populate('user_id').exec(function (error, result) {
  		if (!error) {
  			res.json(result);
  		}
  		else {
  			res.json(error);
  		}
  	});
  },


  /**
   * `EventsController.read()`
   */
  read: function (req, res) {
    return res.json({
      todo: 'read() is not implemented yet!'
    });
  },


  /**
   * `EventsController.add()`
   */
  add: function (req, res) {
  	var eventParams = _.pick(req.body, 'recurrent_event_id', 'date');
  	Events.find(eventParams).exec(function (error, events) {
  		if (error) {
  			res.status(500);
  			res.json(error);
  		}
  		else {
  			Events.create(req.body).then(function (error, insert) {
  				_.each(events, function (event, index) {
  					Events.destroy({id: event.id}).exec(function () {
  						console.log(event);
  					});
  				});
  				res.json(insert);
  			});
  		}
  	});
  },

  oldAdd: function (req, res) {
  	if (req.body) {
  		console.log(req.body);
  		Events.find({
  			start_timestamp: {
  				'<': req.body.start_timestamp
  			},
  			end_timestamp: {
  				'>': req.body.start_timestamp
  			},
  			user_id: req.body.user_id
  		}).exec(function (error, found) {
  			console.log(error, found);
  			if (found.length === 0) {
  				Events.find({
  					start_timestamp: {
  						'<': req.body.end_timestamp
  					},
  					end_timestamp: {
  						'>': req.body.end_timestamp
  					},
  					user_id: req.body.user_id
  				}).exec(function (error, found) {
  					if (found.length === 0) {
						Events.create(req.body).exec(function (error, change) {
							res.json(change);
						});
  					}
  					else {
  						res.status(511);
  						res.json({
  							error: 'An event overlaps the end time'
  						});
  					}
  				});
  			}
  			else {
  				res.status(511);
  				res.json({
  					error: 'An event overlaps the start time'
  				});
  			}
  		});
	}
  },


  /**
   * `EventsController.edit()`
   */
  edit: function (req, res) {
    return res.json({
      todo: 'edit() is not implemented yet!'
    });
  }
};

