/**
 * UsersController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var md5 = require('MD5');
module.exports = {
	/**
	* `UsersController.index()`
	*/
	index: function (req, res) {
		if (req.param('key')) {
			Users.find({
				hash: req.param('key')
			}).exec(function (error, found) {
				if (error) { console.log(error); }
				if (found.length && found[0].type == 'admin') {
					Users.find({
						type: 'employee'
					}).exec(function (error, found) {
						res.json(found);
					});
				}
			});
		}
		else {
			return res.json({
				error: 'invalid request'
			});
		}
	},


	/**
	* `UsersController.add()`
	*/
	add: function (req, res) {
		if (req.body.type) {
			Users.create(req.body).exec(function (error, change) {

				res.json(change);
			});
		}
		else {
			return res.json({
				error: 'invalid request'
			});
		}
	},


	/**
	* `UsersController.read()`
	*/
	read: function (req, res) {
		//console.log(req.param('key'));
		if (req.param('password') && req.param('username')) {
			Users.find({
				username: req.param('username')
			}).exec(function (error, found) {
				if (found.length) {
					if (md5(req.param('password')) == found[0].password) {
						res.json(found[0]);
					}
					else {
						res.status(510);
						res.json({
							error: 'Username or password incorrect'
						});
					}
				}
				else {
					res.status(510);
					res.json({
						error: 'Username or password incorrect'
					});
				}
			});
		}
		else {
			res.status(510);
			return res.json({
				error: 'No username or password'
			});
		}
	},


	/**
	* `UsersController.edit()`
	*/
	edit: function (req, res) {
		return res.json({
			todo: 'edit() is not implemented yet!'
		});
	}
};

