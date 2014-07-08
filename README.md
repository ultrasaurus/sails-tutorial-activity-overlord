# activityOverlord
### a Sails application

http://irlnathan.github.io/sailscasts/blog/archives/


```
sails -v
info: v0.9.16
```

[Episode 1](http://irlnathan.github.io/sailscasts/blog/2013/08/20/building-a-sails-application-ep1-installing-sails-and-create-initial-project/)
```
sails new activityOverlord —linker
cd activityOverlord
sails lift
```

[Episode 2](http://irlnathan.github.io/sailscasts/blog/2013/08/21/building-a-sails-application-ep2-creating-a-sign-up-page/)
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

## Linker Magic
Now we'll take advantage of the linker option (that we specified with sails new), 
just copy bootstrap.css into linker/styles
and jquery.js and bootstrap.js into linker/js
and...
```
sails lift
```
now css and js are automagically added to your layout.ejs file!



