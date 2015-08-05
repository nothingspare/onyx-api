var q = require('q');
var moment = require('moment');
var email = require('emailjs/email');
var md5 = require('MD5');
var _ = require('underscore');

/**
 * UsersController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
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

	hours: function (req, res) {
		//method static variables
		var day = 24;
		var user_columns = ["sunday_user_id", "monday_user_id", "tuesday_user_id", "wednesday_user_id", "thursday_user_id", "friday_user_id", "saturday_user_id"];
		//init ranges
		var start = req.param('start'),
			end = req.param('end'),
			zone = moment().utcOffset();
		//failsafe populate ranges
		if (!start) { start = moment().day(0); } else { start = moment(start); }
		if (!end) { end = moment(start).day(6); }
		//inject timezone
		var range = {
			start: moment(start).utcOffset(zone).format('YYYY-MM-DD HH:mm:ssZ'),
			end: moment(end).utcOffset(zone).format('YYYY-MM-DD HH:mm:ssZ')
		};

		Users.find({status: 1, archived: 0}).exec(function (error, users) {
			var recurrences = [];
			_.each(users, function (user, index) {
				recurrences.push(Events.findByUser(user, range), Recurrent_events.findByUser(user));
			});

			var report = _.indexBy(users, 'id');
			_.each(report, function (user, index) {
				user.hours = [];
				user.delta = [];
				user.shifts = [];
			});

			var timeHelper = {
				getShiftHours: function (shift) {
					if (shift.start_hour > shift.end_hour) {
						//calculate start/end hours starting one calendar date and ending the next calendar date
						total_time = (day - shift.start_hour) + shift.end_hour;
						total_time = total_time + ((shift.end_minute - shift.start_minute)/60);
					}
					else {
						//calculate start/end hours taking place on the same calendar date
						total_time = shift.end_hour - shift.start_hour;
						total_time = total_time + ((shift.end_minute - shift.start_minute)/60);
					}

					return total_time;
				}
			};

			q.allSettled(recurrences).then(function (schedule) {
				var periodValues = _.pluck(schedule, 'value');
				var nonNullPeriods = _.filter(periodValues, function (el) { return el; });
				var periods = _.groupBy(nonNullPeriods, 'type');

				//determine hours for pick up shifts (events)
				_.each(periods.events, function (events, index) {
					//report[events.user.id].list_of_events = events;
					_.each(events.rows, function (period, i) {
						//determine total shift hours
						var total_time = timeHelper.getShiftHours(period.recurrent_event_id);

						if (events.user.id == period.user_id) {
							report[events.user.id].hours.push(total_time);
						}
						else {
							report[events.user.id].hours.push(-total_time);
						}
						
						//report[events.user.id].delta.push(period);
					});

				});
	
				//determine hours for shifts (recurrent_events)
				_.each(periods.shifts, function (shifts, index) {
					_.each(shifts.rows, function (shift, i) {
						var shift_assigned_users = _.filter(shift, function (value, key) { return _.contains(user_columns, key); });
						var user_shift_sort = _.groupBy(shift_assigned_users, function (user_id) { return user_id == shifts.user.id; });
						var count = user_shift_sort["true"].length;

						var hours = timeHelper.getShiftHours(shift);

						report[shifts.user.id].hours.push(hours*count);
						//report[shifts.user.id].shifts.push(shift);
					});
				});

				_.each(report, function (user, index) {
					user.total_hours = _.reduce(user.hours, function (memo, num) { return memo + num; });
					if (user.total_hours > 40) {
						user.overtime = true;
					}
					else {
						user.overtime = false;
					}
				});
				res.json(report);
			});
		});
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
				if (error) {
					return res.json(error);
				}
				if (found && found.length) {
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

	find: function (req, res) {
		Users.find(req.body).exec(function (error, rows) {
			if (!error) {
				res.json(rows);
			}
			else {
				res.json(error);
			}
		});
	},

	textEveryone: function (req, res) {
		var server = email.server.connect({
			user: 'michael@bravewhale.com',
			password: '00feb5meech',
			host: 'smtp.gmail.com',
			ssl: true
		});
		Users.find({archived: 0}).exec(function (error, users) {
			if (error) {
				res.json(error);
			}
			else {
				_.each(users, function (user, index) {
					if (users.phone != "") {
						server.send({
							from: "michael@bravewhale.com",
							cc: user.phone + "@tmomail.net " + user.phone + "@att.net " + user.phone + "mymetropcs.com " + user.phone + "messaging.sprintpcs.com " + user.phone + "vtext.com",
							text: "Schedule Updated: Please visit http://onyx.tools"
						});
					}
				});
				res.json({
					success: true
				});
			}
		});
	},
	/**
	* `UsersController.edit()`
	*/
	edit: function (req, res) {
		// var obj = {
		// 	from: 'Nothingspare <michael@holleran.cc>',
		// 	to: 'michael@bravewhale.com',
		// 	subject: 'Node message',
		// 	text: 'Hello email'
		// };
		// var server = email.server.connect({
		// 	user: 'michael@bravewhale.com',
		// 	password: '00feb5meech',
		// 	host: 'smtp.gmail.com',
		// 	ssl: true
		// });
		// server.send(obj);
		// return;
		if (req.body.password) {
			req.body.password = md5(req.body.password);
		}
		Users.update({
			id: req.body.id
		}, req.body).exec(function (error, result) {
			if (error) {
				res.json(error);
			}
			else {
				res.json(result);
			}
		});
	}
};

