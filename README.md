# activityOverlord
### a Sails application

http://irlnathan.github.io/sailscasts/blog/archives/


```
sails -v
info: v0.9.16
```

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


vi api/controllers/UserController.js
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

also since we're using LESS we can define variables to use in our styles (maybe should be using Bootstrap LESS version?)


mkdir views/user
vi views/user/new.ejs
```
<h1>Sign Up Here</h1>

```

now go to:  http://localhost:1337/user/new
to see the sign up page (or click the button we made on the home screen)

Let's add a form:




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


