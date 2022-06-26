const fs = require('fs');
const Koa = require('koa');
const sharp = require('sharp');
const { get } = require('https');
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
    await next();
});
app.use(async (ctx, next) => {
    const { picture } = ctx.state;

    try {
        await new Promise((resolve, reject) => {
            get('https://cdn.discordapp.com/attachments' + picture.url, res => {
                if (res.statusCode != 200) return reject();

                const path = './temp/' + picture._id;
                const stream = fs.createWriteStream(path);

                res.pipe(stream);
                res.on('end', () => {
                    picture.path = path;
                    picture.name = picture._id + '.jpg';
                    resolve();
                });
                res.on('error', () => {
                    reject();
                });
            });
        });
        await next();
    } catch {
        ctx.throw(410);
    }
});

app.use(async (ctx, next) => {
    const { picture } = ctx.state;

    try {
        const path = './data/' + picture.name;
        await sharp(picture.path)
            .resize(256, 256, {
                position: 'top',
            })
            .toFile(path);

        fs.unlink(picture.path);
        picture.path = path;
        await next();
    } catch {
        ctx.throw(409);
    }
});

app.use(ctx => {
    ctx.body = ctx.state.picture;
});

app.listen(port, () => {
    console.log('App running at port', port);
});
