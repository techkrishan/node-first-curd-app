const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const ContactSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    mobile: Number,
}, {
    timestamps: true
});

ContactSchema.index({first_name: 'text', last_name: 'text', email: 'text'});
// ContactSchema.index({'$**': 'text'});

ContactSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Contact', ContactSchema);