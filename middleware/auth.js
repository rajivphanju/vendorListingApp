
const jwt = require('jsonwebtoken')
const User = require('../model/user')

const auth = async(req, res, next) => {
   
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, "vendorlistingapp")
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ error: 'Unauthorized access!' })
    }

}


module.exports = auth