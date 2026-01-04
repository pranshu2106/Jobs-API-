const User = require('../models/User') ;
const {StatusCodes} = require('http-status-codes') ; 
const {BadRequestError,UnauthenticatedError} = require('../errors') ; 


const register = async (req,res) => {


    const user = await User.create({...req.body}) ; 
    const token = user.createJWT() ; 
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token});
};

const login = async (req,res) => {
    const {email,password} = req.body ;

    if(!email || email == " " || password == " " || !password) {
        throw new BadRequestError(`Please Provide Email and Password`);
    }

    const user = await User.findOne({email}) ; 
    if(!user) {
        throw new UnauthenticatedError(`Please Provide Valid Credentails`) ; 
    }
    const comparison = await user.comparePassword(password) ; 
    if(!comparison) {
        throw new UnauthenticatedError(`Please Provide Correct Password`) ; 
    }
    const token = user.createJWT() ;
    res.status(StatusCodes.OK).json({user:{name:user.name},token}) ; 
}; 

module.exports = {register,login};  

