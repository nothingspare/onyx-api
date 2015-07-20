/**
* Events.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    id : { type: 'integer' },

    type : { type: 'string' },

    start_timestamp : { type: 'string' },

    end_timestamp : { type: 'string' },

    user_id : { type: 'integer' },

    location_id : { type: 'integer' }
  }
};

