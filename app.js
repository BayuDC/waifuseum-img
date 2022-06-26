const Koa = require('koa');
const { ObjectId } = require('mongodb');
const db = require('./db');

const app = new Koa();
const port = process.env.PORT || 3000;

app.context.db = db;

app.use(async (ctx, next) => {
    const { id } = ctx.query;
    if (!id || !ObjectId.isValid(id)) ctx.throw(400);

    const picture = await ctx.db.collection('pictures').findOne(
        { _id: new ObjectId(id) },
        { projection: { url: 1 } }
        //
    );
    if (!picture) ctx.throw(404);

    ctx.state.picture = picture;
    next();
});
app.use(ctx => {
    ctx.body = ctx.state.picture;
});

app.listen(port, () => {
    console.log('App running at port', port);
});
