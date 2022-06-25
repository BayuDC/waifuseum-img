const { get } = require('https');
const { createWriteStream } = require('fs');

module.exports = async picture => {
    const file = await new Promise(resolve => {
        get('https://cdn.discordapp.com/attachments' + picture.url, res => {
            if (res.statusCode != 200) resolve();

            const path = './temp/' + picture._id;
            const stream = createWriteStream('./temp/' + picture._id);

            res.pipe(stream);
            res.on('end', () => {
                resolve({
                    name: picture._id + '.jpg',
                    path,
                });
            });
        });
    });

    if (!file) throw new Error();
    return file;
};
