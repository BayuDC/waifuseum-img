const fs = require('fs');
const Koa = require('koa');
const sharp = require('sharp');
const { get } = require('https');
const { nanoid } = require('nanoid');
const { ObjectId } = require('mongodb');
const { mongo, redis } = require('./db');

const app = new Koa();
const port = process.env.PORT || 3000;

app.context.mongo = mongo;
app.context.redis = redis;

app.use(async (ctx, next) => {
    const { id, size } = ctx.query;

    const cache = await ctx.redis.get(`${id}:${size}`);
    if (!cache) {
        if (!id || !size) ctx.throw(418);
        if (!size.match(/^(thumbnail|minimal|standard|original)$/)) {
            ctx.throw(400);
        }
        return await next();
    }
    ctx.body = fs.createReadStream(cache);
    ctx.attachment(cache, { type: 'inline' });
});

app.use(async (ctx, next) => {
    const { id } = ctx.query;
    if (!ObjectId.isValid(id)) ctx.throw(400);

    const picture = await ctx.mongo.collection('pictures').findOne(
        { _id: new ObjectId(id) },
        { projection: { url: 1, width: 1, height: 1 } }
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
            get(picture.url, res => {
                if (res.statusCode != 200) return reject();

                const path = './temp/' + nanoid();
                const stream = fs.createWriteStream(path);

                res.pipe(stream);
                res.on('end', () => {
                    picture.path = path;
                    picture.type = {
                        'image/png': 'png',
                        'image/jpeg': 'jpg',
                        'image/gif': 'gif',
                        'image/webp': 'webp',
                    }[res.headers['content-type']];

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
        const name = `${picture._id}:${size}`;
        let path = `./data/${name}.`;

        if (size == 'original') {
            path += picture.type;
            await fs.promises.rename(picture.path, path);
        } else {
            path += picture.type = 'webp';
            const options = {};

            switch (size) {
                case 'thumbnail':
                    options.width = options.height = 600;
                    options.position = 'top';
                    break;
                case 'minimal':
                    options.width = picture.width >= picture.height ? 600 : undefined;
                    options.height = picture.height >= picture.width ? 600 : undefined;
                    break;
                case 'standard':
                    options.width = picture.width >= picture.height ? 1200 : undefined;
                    options.height = picture.height >= picture.width ? 1200 : undefined;
                    break;

                default:
                    throw undefined;
            }

            await sharp(picture.path).resize(options).toFormat(picture.type).toFile(path);
        }

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

    ctx.redis.set(picture.name, picture.path);
    ctx.redis.set(picture.name + '*', 1, { EX: 600 });
    ctx.body = fs.createReadStream(picture.path);
    ctx.attachment(picture.path, { type: 'inline' });
});

app.listen(port, () => {
    console.log('App running at port', port);
});
