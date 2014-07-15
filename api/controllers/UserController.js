/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {},

  // This loads the sign-up page --> view/user/new.ejs
  'new': function (req, res) {
  	res.view();
  },

  create: function(req, res) {
    // Create a User with the params sent from
    // the sign-up form --> new.ejs
    User.create(req.params.all(), function userCreated(err, user) {

      if (err) {
        req.session.flash = {
          err: err
        };
        return res.redirect('/user/new');
      }

      //return res.json(user);
      res.redirect('/user/show/'+user.id);
    });
  },

  show: function(req, res) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err || !user) return res.serverError(err);  // !user should be 404
      res.view({user: user});
    });
  },

  index: function(req, res) {
    User.find(function foundUser(err, users) {
      if (err) return res.serverError(err);
      res.view({users: users});
    });
  },

  // render the edit view (e.g. /views/edit.ejs)
  edit: function (req, res) {

    // Find the user from the id passed in via params
    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) return res.serverError(err);
      if (!user) return res.serverError(err); //('User doesn\'t exist.');

      res.view({
        user: user
      });
    });
  },

  // process the info from edit view
  update: function (req, res) {
    User.update(req.param('id'), req.params.all(), function userUpdated (err) {
      if (err) {
        return res.redirect('/user/edit/' + req.param('id'));
      }

      res.redirect('/user/show/' + req.param('id'));
    });
  },

  destroy: function (req, res) {

    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) return res.serverError(err);

      if (!user) res.serverError(err); //('User doesn\'t exist.');

      User.destroy(req.param('id'), function userDestroyed(err) {
        if (err) return res.serverError(err);
      });

      res.redirect('/user');

    });
  }
};
