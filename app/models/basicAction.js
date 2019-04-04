const mongoose = require('mongoose');

let BasicAction = mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    namespace: {
        type: String,
        required: true,
    },
    desciption:{
        type: String,
        required: false,
    },
},{ timestamps: { createdAt: 'createdAt' }});


BasicAction.methods = {
};

module.exports = mongoose.model('BasicAction', BasicAction);
