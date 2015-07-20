/**
 * LocationsController
 *
 * @description :: Server-side logic for managing Locations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	


  /**
   * `LocationsController.index()`
   */
  index: function (req, res) {
		Locations.find({}).exec(function (error, found) {
			res.json(found);
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
    return res.json({
      todo: 'edit() is not implemented yet!'
    });
  }
};

