const mongoose = require('mongoose');
let parameters = require('../config/parameter');
let i = 0;

// Set up default mongoose connection
const connectDB = () => new Promise((resolve, reject) => {
    const url = 'mongodb://'+ parameters.db_user +
        ':'+parameters.db_pass +
        '@'+parameters.db_host +
        ':'+parameters.db_port +
        '/'+parameters.db_db +
        '?authSource=' + parameters.db_admin_db + '&w=1';

    console.log('url',url);


    console.log(`Mongo URL : ${url}`);
    console.log('Try to connect to mongo ...');
    mongoose.Promise = global.Promise;
    // Get the default connection
    mongoose.connect(url);
    const db = mongoose.connection;

    db.once('open', () => {
        console.log('Mongoose connected to Mongo !');
        return resolve();
    });
    // Bind connection to error event (to get notification of connection errors)
    db.on('error', (e) => {
        console.error('Failed to connect to mongo on startup - retrying in 5 sec');
        console.warn(e.stack);
        i += 1;
        if (i > 3) {
            return reject(e);
        }
        setTimeout(connectDB, 5000);
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', () => db.close(() => {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    }));
});

module.exports = connectDB;

