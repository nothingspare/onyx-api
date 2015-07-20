/**
* Locations.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    id : { type: 'integer' },

    name : { type: 'string' },

    street_one : { type: 'string' },

    street_two : { type: 'string' },

    city : { type: 'string' },
    state: { type: 'string' },

    zip : { type: 'string' },

    status : { type: 'integer' },

    handle : { type: 'string' }
  }
};

