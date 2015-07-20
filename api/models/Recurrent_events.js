/**
* Recurrent_events.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    id : { type: 'integer' },

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
    
    sunday_user_id : { type: 'integer' },
    monday_user_id : { type: 'integer' },
    tuesday_user_id : { type: 'integer' },
    wednesday_user_id : { type: 'integer' },
    thursday_user_id : { type: 'integer' },
    friday_user_id : { type: 'integer' },
    saturday_user_id : { type: 'integer' },

    archive: {type: 'integer' }
  }
};
