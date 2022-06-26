const Koa = require('koa');
const db = require('./db');

const app = new Koa();
const port = process.env.PORT || 3000;

app.context.db = db;
app.use(ctx => {
    ctx.body = 'Hello World!';
});

app.listen(port, () => {
    console.log('App running at port', port);
});
