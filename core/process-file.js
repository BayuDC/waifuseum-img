const { createWriteStream, unlink } = require('fs');
const sharp = require('sharp');

module.exports = async (readStream, name) => {
    const file = await new Promise(resolve => {
        const path = './data/temp-' + name;
        const writeStream = createWriteStream(path);

        readStream.pipe(writeStream);
        readStream.on('end', () => {
            sharp(path)
                .resize(256, 256, { position: 'top' })
                .toFile('./data/' + name)
                .then(() => {
                    unlink(path, () => {});
                    resolve({
                        name: name,
                    });
                });
        });
    });

    return file;
};
