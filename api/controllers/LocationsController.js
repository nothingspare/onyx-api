var q = require('q');

/**
 * LocationsController
 *
 * @description :: Server-side logic for managing Locations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
	

	schedule: function (req, res) {
		var params = req.body;
		Recurrent_events.find({
			or: [
				{ sunday_user_id: params.user_id },
				{ monday_user_id: params.user_id },
				{ tuesday_user_id: params.user_id },
				{ wednesday_user_id: params.user_id },
				{ thursday_user_id: params.user_id },
				{ friday_user_id: params.user_id },
				{ saturday_user_id: params.user_id }
			]
		}).exec(function (error, shifts) {
			if (!error) {
				var locationIds = _.pluck(shifts, 'location_id');
				q.all([
					Locations.find({
						id: locationIds
					}),
					Events.find({
						date: {
							'>=': params.startDatetime,
							'<=': params.endDatetime
						},
						user_id: params.user_id
					}).populate('location_id').populate('recurrent_event_id'),
					Events.find({
						date: {
							'>=': params.startDatetime,
							'<=': params.endDatetime
						},
						replacing_user_id: params.user_id
					}).populate('location_id').populate('recurrent_event_id')
				]).spread(function (locations, pickup_shifts, lost_shifts) {
					_.each(pickup_shifts, function (shift) {
						locations[shift.location_id.id] = shift.location_id;
					});
					res.json({
						locations: _.indexBy(locations, 'id'),
						shifts: {
							regular: shifts,
							pickup: pickup_shifts,
							lost: lost_shifts
						}
					});
				});
			}
			else {
				res.json(error);
			}
		});
	},
  /**
   * `LocationsController.index()`
   */
  index: function (req, res) {
	Locations.find({}).exec(function (error, rows) {
		if (!error) {
			res.json(rows);
		}
		else {
			res.json(error);
		}
	});
  },


  /**
   * `LocationsController.read()`
   */
  read: function (req, res) {
    return res.json({
      todo: 'read() is not implemented yet!'
    });
  },


  /**
   * `LocationsController.add()`
   */
  add: function (req, res) {
  	if (req.body.name) {
		Locations.create(req.body).exec(function (error, change) {
			res.json(change);
		});
	}
  },


  /**
   * `LocationsController.edit()`
   */
  edit: function (req, res) {

  	Locations.update({
  		id: req.body.id
  	}, req.body).exec(function (error, change) {
  		if (error) {
  			res.json(error);
  		}
  		else {
  			res.json(change);
  		}
  	});
  }
};

