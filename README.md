# activityOverlord
### a Sails application

http://irlnathan.github.io/sailscasts/blog/archives/


```
sails -v
info: v0.9.16
```

1. [Create the App](#create-the-app)

## Create the App

[Episode 1](http://irlnathan.github.io/sailscasts/blog/2013/08/20/building-a-sails-application-ep1-installing-sails-and-create-initial-project/)
```
sails new activityOverlord —linker
cd activityOverlord
sails lift
```

## Custom Index page with Bootstrap

[Episode 2](http://irlnathan.github.io/sailscasts/blog/2013/08/21/building-a-sails-application-ep2-creating-a-sign-up-page/) and [2a](http://irlnathan.github.io/sailscasts/blog/2013/08/22/building-a-sails-application-ep2a-a-quick-supplement-to-some-stuff-i-forgot-to-mention-in-episode-2/)

```
cd views/
mkdir views/static
vi views/static/index.ejs
```
add some basic HTML
```
<h1>Home Page</h1>
```
now change route in config/routes.js
```
  '/': {
    view: 'static/index'
  }

```
point your broswer to: http://localhost:1337/
and see your new page!
if you 'view source' you see a bunch of other stuff, the source is generated from views/layout.ejs

### Linker Magic
Now we'll take advantage of the linker option (that we specified with sails new),
just copy bootstrap.css into linker/styles
and jquery.js and bootstrap.js into linker/js
and...
```
sails lift
```
now css and js are automagically added to your layout.ejs file!


However, we want to load jquery before bootstrap, so we modify Gruntfile.js to explicitly declare jquery before **/*.js

```
  var jsFilesToInject = [

    // Below, as a demonstration, you'll see the built-in dependencies
    // linked in the proper order order

    // Bring in the socket.io client
    'linker/js/socket.io.js',

    // then beef it up with some convenience logic for talking to Sails.js
    'linker/js/sails.io.js',

    // A simpler boilerplate library for getting you up and running w/ an
    // automatic listener for incoming messages from Socket.io.
    'linker/js/app.js',

    'linker/js/jquery-1.11.1.js',

    // *->    put other dependencies here   <-*

    // All of the rest of your app scripts imported here
    'linker/**/*.js'
  ];

```

vi views/static/index.ejs
```
<div class="container">
  <div class="jumbotron">
    <h1>Activity Overlord</h1>

    <h2>Tracking app activity better than the NSA since 1899.</h2>
    <a href="/user/new" class="btn btn-lg btn-success">Sign up now!</a>
  </div>
</div>
```

vi views/layout.ejs

add header and footer above and below <%- body ->
```
  <body>

    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <a class="navbar-brand" href="/"> activityOverlord</a>
      </div>
    </div>

    <%- body %>

    <div class="container">
      <hr>
      <footer class="footer pull-right">
        <div>
          <div>based on a <a href="http://sailsjs.org/">sails tutorial</a> by irl nathan, with a bunch of help from cody, gabe, heather, mike, scott and zoli</div>
        </div>
      </footer>
    </div>
```

## User model
[Episode 3](http://irlnathan.github.io/sailscasts/blog/2013/08/25/building-a-sails-application-ep3-update-creating-a-user-model-and-controller/)


```
sails generate user
```

Creates two files
- api/controllers/UserController.js
- api/models/User.js

Let's define a schema for our model -- we could add attributes dynamically on the client, but this allows us to add validations.  In this example, name and email are required, and email must be unique and in email format.

vi app/models/User.js
```
  attributes: {

  	name: {
  		type: 'string',
  		required: true
  	},

  	title: {
  		type: 'string'
  	},

  	email: {
  		type: 'string',
  		email: true,
  		required: true,
  		unique: true
  	},

  	encryptedPassword: {
  		type: 'string'
  	}

  }
```

### Create New action

vi api/controllers/UserController.js

Note: new needs to be quoted since new is a reserved word in Javascript

```
  'new': function (req, res) {
  	res.view();
  }
```

We can just dropp LESS files into linker/styles -- this pushes the page below the header
vi assets/linker/styles/custom.less
```
body {
	padding-top: 60px;
	padding-bottom: 40px;
}
```

also since we're using LESS we can define variables to use in our styles

mkdir views/user
vi views/user/new.ejs
```
<h1>Sign Up Here</h1>

```

now go to:  http://localhost:1337/user/new
to see the sign up page (or click the button we made on the home screen)

This route was create through sails blueprints.  In config/controllers.js, blueprints are configured to be true which save us from manually configuring our routes (which we would do in config/routes.js)


### Add Sign-up Form


vi views/user/new.ejs


```
<form action="/user/create" method="POST" class="form-signin">
	<h2>Make an account</h2>

	<input type="text" class="input-block-level" placeholder="your name" name="name">

	<input type="text" class="input-block-level" placeholder="your title" name="title">

	<input type="text" class="input-block-level" placeholder="email address" name="email">

	<input type="password" class="input-block-level" placeholder="password" name="password">

	<input type="password" class="input-block-level" placeholder="password confirmation" name="confirmation">
	<br />

	<input type="submit" class="btn btn-large btn-primary" value="Create User"/>
	<input type="hidden" name="_csrf" value="<%= _csrf %>" />
</form>
```

## Creating a User account
[Episode 4](http://irlnathan.github.io/sailscasts/blog/2013/08/26/building-a-sails-application-ep4-creating-a-user-account/)

```csrf``` (cross site request forgery) is ```false``` by default

in ```config/csrf.js```, change to true:

```
module.exports.csrf = true;
```

This will protect our webapp from cross-site scripting attack once we open up the abilitiy to modify data with our API.

we send this back to the server in ```views/user/new.js```

```
	<input type="hidden" name="_csrf" value="<%= _csrf %>" />
```

We write the ```create``` action in ```api/controllers/UserController.js```
Note: below differs from the video, see: https://github.com/balderdashy/sails/issues/1153

```
  create: function(req, res) {
    // Create a User with the params sent from
    // the sign-up form --> new.ejs
    User.create(req.params.all(), function userCreated(err, user) {

     if (err) return res.serverError(err);
     else return res.json(user);
    })
  }
```

By default this will save everything from the form in the database, but we want just the fields that we've defined in the user model.

in ```api/models/User.js``` set:

```
module.exports = {

  schema: true,
```

Then only attributes defined in the schema will be returned.  Seems like encrypted password shouldn't be, but we're not defining it yet, so we'll get to that in a future episode.

## Validation Errors

[Episode 5](http://irlnathan.github.io/sailscasts/blog/2013/08/27/building-a-sails-application-ep4-handling-validation-errors-with-a-flash-message/)

Create a flash message and inject it into the sign-up page.

in ```/views/user/UserController.js``` we store the error in the request session object, which will be persistent across web pages (and clear it in the case of a success)

```
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
      return res.json(user);
      req.session.flash = {};
    });
  }
```

then we change the ```new``` method to make the error available to the view (after the redirect)

```
  'new': function (req, res) {
    res.locals.flash = _.clone(req.session.flash);
  	res.view();
    req.session.flash = {};
  },
```

next let's display the error in the view -- for now, we won't make it pretty, just show the object

in ```views/user/new.js```

```
<form action="/user/create" method="POST" class="form-signin">
	<h2>Sign Up Here</h2>

	<% if(flash && flash.err) { %>
		<ul class="alert alert-success">
	<% Object.keys(flash.err).forEach(function(error) { %>
		<li><%- JSON.stringify(flash.err[error]) %></li>
	<% }) %>
	</ul>
	<% } %>
```

## Creating a Policy and Adding Client-side Validation
[Episode 6](http://irlnathan.github.io/sailscasts/blog/2013/08/28/building-a-sails-application-ep5-creating-a-policy-and-adding-client-side-validation/)

in ```api/policies/flash.js```

```
module.exports = function(req, res, next) {

 res.locals.flash = {};

 if(!req.session.flash) return next();

 res.locals.flash = _.clone(req.session.flash);

 // clear flash
 req.session.flash = {};

 next();
};

```

then in ```config/policies.js``` make it so all controllers go through the flash policy:

```
module.exports.policies = {

  // Default policy for all controllers and actions
  // (`true` allows public access)
  '*': 'flash'
```

## Client-side validation

download [jquery-validation](http://jqueryvalidation.org/)
and put into ```assets/linker/js```

then edit ```Gruntfile.js``` to make sure it is loaded AFTER jquery

```
    'linker/js/jquery-1.11.1.js',
    'linker/js/jquery.validate-1.13.0.min.js',

    // All of the rest of your app scripts imported here
    'linker/**/*.js'
```

and then add custom validation js, by creating a file (could be named anything)

vi ```assets/linker/js/customValidate.js```

```
$(document).ready(function(){

	// Validate
	// http://bassistance.de/jquery-plugins/jquery-plugin-validation/
	// http://docs.jquery.com/Plugins/Validation/
	// http://docs.jquery.com/Plugins/Validation/validate#toptions

		$('.form-signin').validate({
	    rules: {
	      name: {
	        required: true
	      },
	      email: {
	        required: true,
	        email: true
	      },
	      password: {
	      	minlength: 6,
	        required: true
	      },
	      confirmation: {
	      	minlength: 6,
	      	equalTo: "#password"
	      }
	    },
			success: function(element) {
				element
				.text('OK!').addClass('valid')
			}
	  });

});
```

## Simple Show Page

[Episode 7](http://irlnathan.github.io/sailscasts/blog/2013/08/28/building-a-sails-application-ep7-adding-a-show-action-a-dot-k-a-a-profile-page/)



in ```/api/controllers/UserController.js```

we'll do a redirect, isntead of just returning the json at the end of the ```create``` action
```
      res.redirect('/user/show/'+user.id);
```

create new controller action:

```
  show: function(req, res) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err || !user) return res.serverError(err);
      res.view({user: user});
    });
  }
```

new file for the view:  ```/views/users/show.ejs```

```
<div class='container'>
	<h1><%- user.name %> </h1>
	<h3><%- user.title %> </h3>
	<hr>
	<h3>contact: <%- user.email %> </h3>

	<a class="btn btn-medium btn-primary" href="/user/edit/<%= user.id %>">Edit</a>

</div>

```



##Questions

* maybe should be using Bootstrap LESS version?


