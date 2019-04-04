const mongoose = require('mongoose');
const { Mixed } = mongoose.Schema.Types;

let AppParam = mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    value: {
        type: Mixed
    },
},{ timestamps: { createdAt: 'createdAt' }});


AppParam.methods = {
};

module.exports = mongoose.model('AppParam', AppParam);
