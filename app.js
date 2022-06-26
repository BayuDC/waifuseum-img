const Koa = require('koa');

const app = new Koa();
const port = process.env.PORT || 3000;

app.use(ctx => {
    ctx.body = 'Hello World!';
});

app.listen(port, () => {
    console.log('App running at port', port);
});
