/**
* Recurrent_events.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    id : { type: 'integer', primaryKey: true },

    location_id: { type: 'integer'},


    created : { type: 'string' },

    start_date : { type: 'string' },

    start_hour : { type: 'integer' },

    start_minute : { type: 'integer' },

    end_hour : { type: 'integer' },

    end_minute : { type: 'integer' },

    sunday_shift: { type: 'integer' },
    monday_shift: { type: 'integer' },
    tuesday_shift: { type: 'integer' },
    wednesday_shift: { type: 'integer' },
    thursday_shift: { type: 'integer' },
    friday_shift: { type: 'integer' },
    saturday_shift: { type: 'integer' },
    
    sunday_user_id : { type: 'integer', model: 'Users' },
    monday_user_id : { type: 'integer', model: 'Users' },
    tuesday_user_id : { type: 'integer', model: 'Users' },
    wednesday_user_id : { type: 'integer', model: 'Users' },
    thursday_user_id : { type: 'integer', model: 'Users' },
    friday_user_id : { type: 'integer', model: 'Users' },
    saturday_user_id : { type: 'integer', model: 'Users' },

    archive: {type: 'integer' },
    events: {
    	collection: 'Events',
    	via: 'recurrent_event_id'
    }
  },
  findByUser: function (user) {
  	return this.find({
			or: [
				{ sunday_user_id: user.id },
				{ monday_user_id: user.id },
				{ tuesday_user_id: user.id },
				{ wednesday_user_id: user.id },
				{ thursday_user_id: user.id },
				{ friday_user_id: user.id },
				{ saturday_user_id: user.id }
			]
		}).then(function (rows) {
			if (!rows.length) { return; }
			var shifts = {
				type: 'shifts',
				rows: rows,
				user: user
			};
			return shifts;
		});
  }


};
