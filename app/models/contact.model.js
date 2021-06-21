const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const ContactSchema = mongoose.Schema({
    first_name: {
        type: String,
        trim: true,
        required: true,
        maxLength: 50
    },
    last_name: {
        type: String,
        trim: true,
        required: true,
        maxLength: 50
    },
    email: {
        type: String,
        trim: true,
        required: true,
        maxLength: 100,
        validate: [validateEmail, "Please provide a valid email address."],
        unique: [true, "This email already exists."]
    },
    mobile: {
        type: Number,
        required: true,
        min: 1000000000,
        max: 9999999999
    },
}, {
    timestamps: true
});

ContactSchema.index({first_name: 'text', last_name: 'text', email: 'text'});
// ContactSchema.index({'$**': 'text'});

ContactSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Contact', ContactSchema);