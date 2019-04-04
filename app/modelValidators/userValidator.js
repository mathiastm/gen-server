let validatorCustom = require('../customs/customValidator');
let User = require('../models/user');

let UserValidator = {
    firstName: {
        validate: [{
            validator: function (value, arg) {
                console.log(arg);
                return value.trim() !== '' && value.trim().length > 1;
            },
            message: 'This value is required. ( at least 2 characters )'
        }]
    },
    lastName: {
        validate: [{
            validator: function (value, arg) {
                return value.trim() !== '' && value.trim().length > 1;
            },
            message: 'This value is required. ( at least 2 characters )'
        }]
    },
    password: {
        title: 'Mot de passe',
        validate: [{
            validator: function (value, arg) {
                return validatorCustom.containsSpecialChar(value);
            },
            message: 'The password must contain at least 1 special character'
        }]
    },
    email: {
        validate: [
            {
                validator: 'isEmail',
                message: 'This value must be a valid email address'
            },
            {
                validator: async function (value, arg, model) {
                    return await User.emailAvailable(value, model);
                },
                message: 'This email is not available.'
            }
        ]
    },
    roles: {
        validate: [{
            validator: function (value, arg) {
                return value.length > 0;
            },
            message: 'This value is required ( at least 1 role )'
        }]
    }
};

module.exports = UserValidator;
