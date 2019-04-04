// =======================
// get the packages we need ============
// =======================
require('dotenv').load();

const mongoConnector = require('./app/mongo/mongo-connector')
const modelsLoader = require('./app/models/modelsLoader')
const initDB = require('./app/mongo/setup')

global.Promise = require('bluebird');

let userController = require("./app/controllers/userController");


let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let morgan = require('morgan');
let cors = require('cors');
global.Promise = require("bluebird");


// =======================
// configuration =========
// =======================
let port = process.env.PORT || 1000;
let originsWhitelist = [
    'http://localhost:3000',      //this is my front-end url for development
    'http://localhost:3001',      //this is my front-end url for development
    'http://localhost:5000',      //this is my front-end url for development
    'https://angular-skeleton.firebaseapp.com',
    '*',
];

const initApp = function () {
    let corsOptions = {
        origin: function (origin, callback) {
            let isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
            callback(null, isWhitelisted);
        },
        credentials: true
    };

    //here is the magic
    app.use(cors(corsOptions));

    // use body parser so we can get info from POST and/or URL parameters
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json({limit: '50mb'}));

    // use morgan to log requests to the console
    app.use(morgan('dev'));

}


const loadRoutes = function() {
    return new Promise((resolve, reject) => {
        // =======================
        // routes ================
        // =======================
        // basic route
        app.get('/', function (req, res) {
            res.send('Hello! The API is at http://localhost:' + port + '/api');
        });

        // basic route
        app.get('/setup', function (req, res) {

            let Setup = require('./app/mongo/setup');

            Setup.init(req, res);
        });

        // apply the routes to our application with the prefix /api
        app.use('/api/user', require('./app/routes/userRoutes'));
        app.use('/api/app', require('./app/routes/appRoutes'));
        app.use('/api/entity', require('./app/routes/entityRoutes'));

        resolve();
    });
};


const appListen = function(){
    return new Promise((resolve, reject) => {
        // =======================
        // start the server ======
        // =======================
        app.listen(port);
        console.log('listening on http://localhost:' + port);
        resolve();
    });
}



try {
    mongoConnector()
        .then(modelsLoader)
        .then(initDB.init)
        .then(initApp)
        .then(loadRoutes)
        .then(appListen)
        .catch((e) => {
            console.warn(e.stack);
            console.trace(e);
            process.exit(1);
        });
} catch (e) {
    console.trace(e);
    process.exit(1);
}
