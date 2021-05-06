const colors = require('colors')
const mongo = require('../../util/mongo.js');

module.exports = async () => {
    console.log("MonkeyBot Online" .magenta);
    await mongo().then(mongoose => {
        console.log('Connected to Mongo' .green);
    });
}