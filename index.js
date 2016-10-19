var koa    = require('koa'),
    pug = require('koa-pug'),
    serve  = require('koa-static'),
    path   = require('path'),
    app    = koa(),
    http   = require('http').createServer(app.callback()),
    router = require('koa-router')();

app.use(serve(__dirname + '/www'));

new pug({
    viewPath: __dirname + '/views',
    debug: false,
    pretty: false,
    app: app
});

router
  .get('/', function *(next) {
    this.render('index');
  })

app.use(router.routes());

http.listen(80, function() {
  console.log("Listening on port 80");
});
