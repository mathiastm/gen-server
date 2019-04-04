let express = require('express');
let appRouter = express.Router();
let appController = require('../controllers/appController');
let RouteMiddleware = require('../middlewares/routeMiddleware');


//======================//
// Public access routes //
//======================//
appRouter.get('/getDefaultConfiguration', function(req, res) {
    appController.getDefaultConfiguration(req,res);
});

//=======================//
// Private access routes //
//=======================//
RouteMiddleware.init(appRouter);

// route to check token
appRouter.post('/changeTheme', function(req, res) {
    appController.changeAppTheme(req,res);
});

module.exports = appRouter;
