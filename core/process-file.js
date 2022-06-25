const { createWriteStream } = require('fs');

module.exports = async (readStream, name) => {
    const file = await new Promise(resolve => {
        const path = './data/' + name;
        const writeStream = createWriteStream(path);

        readStream.pipe(writeStream);
        readStream.on('end', () => {
            resolve({
                path: path,
            });
        });
    });

    return file;
};
