const User = require('../models/user');

const ProfileValidator = {
    firstName: {
        validate: [{
            validator: function (value, arg) {
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
    }
};

module.exports = ProfileValidator;
