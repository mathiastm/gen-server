const modelConfig = require('../customs/modelConfig');
const mongoose = require('mongoose');
const passwordHash = require('password-hash');
const jwt = require('jwt-simple');
const parameter = require('../config/parameter');
const BasicAction = require('./basicAction'); // get our mongoose model
const RoleSchema = require('./role'); // get our mongoose model

let User = mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        unique: false,
    },
    lastName: {
        type: String,
        unique: false,
    },
    gender: {
        type: String,
        unique: false,
    },
    username: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true
    },
    profileImg: {
        type: String,
    },
    profileColorClass: {
        type: String,
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Role'
    }],

}, {timestamps: {createdAt: 'createdAt'}});


User.methods = {
    authenticate: function (password) {
        return passwordHash.verify(password, this.password);
    },
    getToken: function () {
        return jwt.encode(this._id, parameter.token_secret);
    },
    modelFormat: function (model = this) {
        return new Promise((resolve, reject) => {
            //Exclude fields
            let excludedFields = [
                'password',
                'roles',
            ];
            const formatedModel = {...modelConfig.returnExcludedModel(model, excludedFields)._doc};


            // Add basic actions
            formatedModel.basicActions = [];
            model.roles.forEach(async (roleId) => {
                RoleSchema.findOne({_id: roleId}).populate({
                    path: 'basicActions'
                }).then((populatedRole) => {
                    populatedRole.basicActions.forEach((ba) => {
                        if (!formatedModel.basicActions.includes(ba.code)) formatedModel.basicActions.push(ba.code);

                    });
                    resolve(formatedModel);
                })
            });
        });
    },

    haveBasicAction: async function (basicAction) {
        let user = await this.modelFormat();
        return new Promise((resolve, reject) => {
            //TODO: CHECK IF USER HAVE BASIC ACTION
            // if(user.basicActions.includes(basicAction)) resolve(true);
            // else resolve(false);
            resolve(true);
        });
    },
};

User.statics = {
    emailAvailable: async function (email, user) {
        return new Promise((resolve, reject) => {
            let filters = {email: email.toLowerCase()};
            console.log("user", user);
            if (user._id) filters._id = {$ne: user._id};

            this.findOne(filters).exec().then(user => {
                if (user) resolve(false);
                else resolve(true);
            })
        });
    }
};

module.exports = mongoose.model('User', User);
