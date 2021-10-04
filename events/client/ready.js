const colors = require('colors')
const mongo = require('@util/mongo');

module.exports = async () => {
    console.log("MonkeyBot Online" .magenta);
    await mongo().then(() => {
        console.log('Connected to Mongo' .green);
    });
}