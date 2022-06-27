const fs = require('fs');
const Koa = require('koa');
const sharp = require('sharp');
const { get } = require('https');
const { nanoid } = require('nanoid');
const { ObjectId } = require('mongodb');
const db = require('./db');

const app = new Koa();
const port = process.env.PORT || 3000;

app.context.db = db;
app.context.caches = new Map();

app.use(async (ctx, next) => {
    const { id, size } = ctx.query;
    if (!id || !size) ctx.throw(418);
    if (!size?.match(/^(thumb|orig)$/)) ctx.throw(400);

    const cache = ctx.caches.get(`${size}-${id}`);
    if (!cache) return await next();

    ctx.body = fs.createReadStream(cache);
    ctx.attachment(cache, { type: 'inline' });
});

app.use(async (ctx, next) => {
    const { id } = ctx.query;
    if (!ObjectId.isValid(id)) ctx.throw(400);

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

                const path = './temp/' + nanoid();
                const stream = fs.createWriteStream(path);

                res.pipe(stream);
                res.on('end', () => {
                    picture.path = path;
                    resolve();
                });
                res.on('error', () => {
                    reject();
                });
            });
        });
    } catch {
        ctx.throw(410);
    }

    await next();
});

app.use(async (ctx, next) => {
    const { size } = ctx.query;
    const { picture } = ctx.state;

    try {
        const name = `${size}-${picture._id}`;
        const path = `./data/${name}.jpg`;

        await sharp(picture.path)
            .resize(256, 256, {
                position: 'top',
            })
            .toFile(path);

        fs.unlink(picture.path, () => {});
        picture.path = path;
        picture.name = name;
    } catch {
        ctx.throw(409);
    }

    await next();
});

app.use(ctx => {
    const { picture } = ctx.state;

    ctx.caches.set(picture.name, picture.path);
    ctx.body = fs.createReadStream(picture.path);
    ctx.attachment(picture.path, { type: 'inline' });
});

app.listen(port, () => {
    console.log('App running at port', port);
});
