const mongoose = require('mongoose');

let Role = mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    basicActions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BasicAction' }],
},{ timestamps: { createdAt: 'createdAt' }});


Role.methods = {
};

module.exports = mongoose.model('Role', Role);
