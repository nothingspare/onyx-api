/**
* Events.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    id : { type: 'integer', primaryKey: true },

    recurrent_event_id: { type: 'integer', model: 'Recurrent_events' },

    type : { type: 'string' },

    date : { type: 'string' },

    day: {type: 'string' },

    user_id : { type: 'integer', model: 'Users' },

    replacing_user_id: { type: 'integer', model: 'Users' },

    location_id : { type: 'integer', model: 'Locations' }
  },

  findByUser: function (user, params) {
  	return this.find({
		date: {
			'>=': params.start,
			'<=': params.end
		},
		or: [
			{ user_id: user.id },
			{ replacing_user_id: user.id }
		]
	}).populate('recurrent_event_id').then(function (rows) {
		if (!rows.length) { return; }
		var events = {
			type: 'events',
			rows: rows,
			user: user
		}
		return events;
	});
  }
};

