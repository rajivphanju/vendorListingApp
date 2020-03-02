const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstName: {
        type: String,
        // required: [true, 'Required']
    },
    lastName: {
        type: String,
        // required: [true, 'Required']
    },
    contactAddress: {
        type: String,
        // required: [true, 'Required']
    },
    emailAddress: {
        type: String,
        // required: [true, 'Required']
    },
    username: {
        type: String,
        required: [true, 'Required']
    },
    password: {
        type: String,
        required: [true, "required"]
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.methods.generateAuthToken = async function () {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({
        _id: user._id.toString()
    }, "vendorlistingapp")
    user.tokens = user.tokens.concat({
        token: token
    })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (username, password) => {

    // Search for a user by email and password.
    const user = await User.findOne({
        username: username
    })

    if (!user) {
        throw new Error('Invalid login credentials')
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error('Wrong Password')
    }
    return user
}


const User = mongoose.model('user', userSchema);
module.exports = User;