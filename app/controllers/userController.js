let User = require('../models/user');
let Parameters = require('../config/parameter');

let queryBuilder = require('../helpers/queryBuilder');
let jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

let dataBaseHelper = require('../helpers/dataBaseHelper');

let userController = {

        index: function (req, res) {
            res.status(200).json({message: 'Welcome to the coolest API on earth!'});
        },

        checkToken: (req, res) => {
            if (req.decoded) {
                User.findOne({_id: req.decoded}).then(async (user) => {
                    if (!user) {
                        res.status(200).json(
                            {
                                success: false,
                                message: "User not found : " + req.decoded
                            }
                        );
                    } else {
                        res.status(200).json(
                            {
                                // return the information including token as JSON
                                success: true,
                                user: await user.modelFormat(user)
                            }
                        );
                    }
                })
            } else {
                res.status(200).json(
                    {
                        success: false,
                        message: "No token provided"
                    }
                );
            }
        },

        changeProfileColorClass: (req, res) => {
            if (req.decoded) {
                User.findOne({_id: req.decoded}).then((user) => {
                    if (user) {
                        user.profileColorClass = req.body.profileColorClass;
                        user.save().then((user, err) => {
                            if (err) {
                                res.status(200).json(
                                    {
                                        success: false,
                                        message: "User not seved : " + err
                                    }
                                );
                            } else {
                                res.status(200).json(
                                    {
                                        // return the information including token as JSON
                                        success: true,
                                        profileColorClass: user.profileColorClass,
                                    }
                                );
                            }

                        })

                    } else {
                        res.status(200).json(
                            {
                                success: false,
                                message: "User not found",
                            }
                        );
                    }
                })
            } else {
                res.status(200).json(
                    {
                        success: false,
                        message: "No token provided"
                    }
                );
            }
        },

        getUserById: function (req, res) {
            if (req.decoded) {
                User.findOne({_id: req.id}).then((user) => {
                    if (!user) {
                        res.status(200).json(
                            {
                                success: false,
                            }
                        );
                    } else {
                        res.status(200).json(
                            {
                                // return the information including token as JSON
                                success: true,
                                user: user.modelFormat(user)
                            }
                        );
                    }
                })
            } else {
                res.status(200).json(
                    {
                        success: false,
                    }
                );
            }
        },

        postAuthenticate: function (req, res) {
            User.findOne({username: req.body.username}, async function (err, user) {
                if (err) {
                    res.status(500).json({
                        "text": "Erreur interne"
                    })
                } else if (!user) {
                    res.status(200).json({
                        success: false,
                        text: 'Authentication failed. User not found.'
                    });
                } else {
                    if (user.authenticate(req.body.password)) {
                        res.status(200).json(
                            {
                                // return the information including token as JSON
                                success: true,
                                text: 'Enjoy your token!',
                                token: user.getToken(),
                                user: await user.modelFormat(user)
                            }
                        );
                    } else {
                        res.status(401).json({
                            success: false,
                            text: "'Authentication failed. Wrong password.'"
                        })
                    }
                }
            });
        },
        getUserById: function (req, res) {
            User.findOne({_id: req.params.id}, function (err, user) {
                if (err) {
                    res.status(500).json({
                        "text": "Erreur interne"
                    })
                } else if (!user) {
                    res.status(401).json({text: 'User not found.'});
                } else {
                    res.status(200).json(user.modelFormat(user));
                }
            })
        },

        save: async function (req, res) {
            let ValidateModel = require('../helpers/validator');
            let validateAll = ValidateModel.validateAll;
            let profileValidator = require('../modelValidators/profileValidator');

            let user = req.body.user;
            let result = await validateAll(profileValidator, user);
            if (result.valid) {
                //affecte le password
                const passwordHash = require("password-hash");
                if (user.password) user.password = passwordHash.generate(user.password);

                //création / modification de l'utilisateur
                let _user;
                if(user._id) {
                    _user = await User.findOne({_id: user._id});
                    _user = Object.assign(_user ,user)
                }
                else _user = new User(user);

                _user.save(async (err) => {
                    if (err) {
                        result.valid = false;
                        result.message = "Saving error..." + err;
                    }
                    result.user = await _user.modelFormat(_user)
                    res.json(result);
                });
            } else {
                res.json(result);
            }
        },

        removeUser: function (req, res) {

        }
    }
;

module.exports = userController;
