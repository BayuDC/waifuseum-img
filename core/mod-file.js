const { createWriteStream, unlink } = require('fs');
const sharp = require('sharp');

module.exports = async file => {
    return await new Promise(resolve => {
        sharp(file.path)
            .resize(256, 256, { position: 'top' })
            .toFile('./data/' + file.name)
            .then(() => {
                unlink(file.path, () => {});
                resolve();
            });
    });
};
