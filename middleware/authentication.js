const User = require('../models/User') ;
const jwt = require('jsonwebtoken') ;
const {UnauthenticatedError} = require('../errors/unauthenticated') ; 

const authMiddleware = async (req,res,next) => {
    const authheaders = req.headers.authorization ;
    if(!authheaders || !authheaders.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication Error') ; 
    }
    const token = authheaders.split(' ')[1] ;
    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET) ;
        req.user = {userId:payload.userId,name:payload.name} ; 
        next() ;
    } catch (error) {
        throw new UnauthenticatedError('Authentication Invalid') ; 
    }

}

module.exports = authMiddleware ; 