const modelConfig = require('../customs/modelConfig');
const mongoose = require('mongoose');
const passwordHash = require('password-hash');
const jwt = require('jwt-simple');
const parameter = require('../config/parameter');
const BasicAction = require('./basicAction'); // get our mongoose model
const RoleSchema = require('./role'); // get our mongoose model

let Entity = mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true
    },
}, {timestamps: {createdAt: 'createdAt'}});


Entity.methods = {
    modelFormat: function (model = this) {
        return new Promise((resolve, reject) => {
            //Exclude fields
            let excludedFields = [];
            const formatedModel = {...modelConfig.returnExcludedModel(model, excludedFields)._doc};

            resolve(formatedModel);

        });
    },
};

Entity.statics = {
    nameAvailable: async function (name, entity) {
        return new Promise((resolve, reject) => {
            let filters = {name: name.toLowerCase()};
            if (entity._id) filters._id = {$ne: entity._id};

            this.findOne(filters).exec().then(entity => {
                if (entity) resolve(false);
                else resolve(true);
            })
        });
    }
};

module.exports = mongoose.model('Entity', Entity);
