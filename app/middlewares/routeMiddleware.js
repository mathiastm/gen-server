let Parameters = require('../config/parameter')
let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
let UserSchema = require('../models/user')

let RouteMiddleware = {
    init: function(Router){
        // route middleware to verify a token
        Router.use(function(req, res, next) {

            // check header or url parameters or post parameters for token
            let token = req.body.token || req.query.token || req.headers['x-access-token'];

            // decode token
            if (token) {
                // verifies secret and checks exp
                jwt.verify(token, Parameters.token_secret, function(err, decoded) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: 'Failed to authenticate token.'
                        });

                    } else {
                        // if everything is good, save to request for use in other routes
                        req.decoded = decoded;
                        UserSchema.findOne({_id: decoded}).then(async user=>{
                            if(user){
                                user.haveBasicAction().then(haveAccess=>{
                                    if(haveAccess) next();
                                    else{
                                        return res.send({
                                            success: false,
                                            message: 'Access denied'
                                        });
                                    }
                                });
                            }else{
                                // return an error
                                return res.send({
                                    success: false,
                                    message: 'No user found for ID: '+ decoded
                                });
                            }
                        });
                    }
                });

            } else {

                // if there is no token
                // return an error
                return res.send({
                    success: false,
                    message: 'No token provided.'
                });

            }
        });
    }
};

module.exports = RouteMiddleware;
