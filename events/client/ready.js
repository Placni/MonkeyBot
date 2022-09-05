const log = require('ololog');
const mongo = require('@util/mongo');

module.exports = async () => {
    log.magenta('Monkeybot Online');
    await mongo().then(() => {
        log.green('Connected to Mongo');
    });
};