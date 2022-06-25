const { get } = require('https');

module.exports = async picture => {
    const stream = await new Promise(resolve => {
        get('https://cdn.discordapp.com/attachments' + picture.url, res => {
            resolve(res.statusCode == 200 ? res : undefined);
        });
    });

    if (!stream) throw new Error();
    return stream;
};
