const jwt = require('jsonwebtoken')
const User = require('../models/users')



const auth = async (req, res, next) => {
    try{
       
        //console.log(req.cookies.authcookie)
        const token = req.cookies.authcookie//req.header('Authorization').replace('Bearer ','')
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        //console.log(decoded)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user){
            throw new Error()
        }
        
        req.token = token
        req.user = user
        next()

    }catch(e){
        //res.status(400).send({error: 'Please authenticate'})
        res.redirect('/')
    }
}

module.exports = auth