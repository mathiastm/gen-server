let express = require('express');
let userRouter = express.Router();
let userController = require('../controllers/userController');
let RouteMiddleware = require('../middlewares/routeMiddleware');


//======================//
// Public access routes //
//======================//
// route to authenticate a user (POST http://localhost:8080/api/user/authenticate)
userRouter.post('/authenticate', function (req, res) {
    userController.postAuthenticate(req, res);
});


//=======================//
// Private access routes //
//=======================//
RouteMiddleware.init(userRouter);

// route to show a random message (GET http://localhost:8080/api/user)
userRouter.get('/', function(req, res) {
    userController.index(req,res)
});

// route to check token
userRouter.get('/checkToken', function(req, res) {
    userController.checkToken(req,res);
});

// route to get user by id
userRouter.get('/get/:id', function(req, res) {
    userController.getUserById(req,res);
});

// route to show a random message (POST http://localhost:8080/api/user)
userRouter.post('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/user/users)
userRouter.get('/users', function(req, res) {
    userController.getUsers(req, res);
});

// save user
userRouter.post('/save', function(req, res) {
    userController.save(req, res);
});

// change profile color
userRouter.post('/changeProfileColorClass', function(req, res) {
    userController.changeProfileColorClass(req, res);
});

// remove user
userRouter.delete('/remove/:id', function(req, res) {
    userController.removeUser(req, res);
});


module.exports = userRouter;
