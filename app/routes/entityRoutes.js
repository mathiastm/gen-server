let express = require('express');
let entityRouter = express.Router();
let entityController = require('../controllers/entityController');
let RouteMiddleware = require('../middlewares/routeMiddleware');


//======================//
// Public access routes //
//======================//

//=======================//
// Private access routes //
//=======================//
RouteMiddleware.init(entityRouter);

// route to check token
entityRouter.get('/list', function(req, res) {
    entityController.getEntityList(req,res);
});

module.exports = entityRouter;
