let validatorCustom = require('../customs/customValidator');

let HeroValidator = {
    name: {
        validate: [{
            validator: function(value, arg){
                return value.trim() !== '' && value.trim().length > 1;
            },
            message: 'This value is required. ( at least 2 characters )'
        }]
    },
};

module.exports = HeroValidator;