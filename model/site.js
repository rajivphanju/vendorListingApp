const mongoose = require('mongoose');
const validator = require('validator')
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const siteSchema = new Schema({
    legal_name: {
        type: String,
        unique: true,
        required: [true, 'Name is Empty']
    },
    pan_vat: {
        type: Number,
        unique: true,
        required: [true, 'PAN Number is Empty']
    },
    contact_person: {
        type: String,
        unique: true,
        required: [true, 'Contact PErson is Empty']
    },
    mobile_number: {
        type: Number,
        unique: true,
        minlength: [10, 'Invalid Phone Number'],
        required: [true, 'Mobile Number is Empty']
    },
    email: {
        type: String,
        required: [true, 'Your email is Empty'],
        unique: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Enter valid email',
            isAsync: false
        }
    },
    shop_category: {
        type: String,
        required: [true, 'Empty Category'],
        lowercase: true,
    },
    landmark_nearby: {
        type: String,
        required: true
    },
    full_address: {
        type: String,
        required: true
    },
    store_location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

    image_names: {
        type: [String],
        required: true
    },
    verification_image: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        default: "pending",
        required: true
    },
    remarks: {
        type: String
    }




});
siteSchema.plugin(uniqueValidator);

const Site = mongoose.model("site", siteSchema);
module.exports = Site;