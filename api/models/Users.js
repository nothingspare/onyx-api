/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs :: http://sailsjs.org/#!documentation/models
*/
module.exports = {
	attributes: {
		id : { type: 'integer' },
		type : { type: 'string' },
		username : { type: 'string', required: true },
		first_name : { type: 'string' },
		last_name : { type: 'string', required: true },
		phone : { type: 'string' },
		email : { type: 'email' },
		password : { type: 'string' },
		hash : { type: 'string' },
		status : { type: 'integer' },
		created : { type: 'string' }
	},

};

