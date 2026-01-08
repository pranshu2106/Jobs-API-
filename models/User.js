const mongoose = require('mongoose') ;
const bcryptjs = require('bcryptjs') ; 
const jwt = require('jsonwebtoken') ;  

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please Provide the Name'],
        minlength: 3,
        maxlength: 50 ,
    } ,

    email: {
        type: String ,
        required: [true,'Please Provide Email'] ,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please Provide Valid Email'
        ],
        unique: true ,
    } ,

    password: {
        type: String,
        required: [true,'Please Enter Your Password'] ,
        minlength: 8 ,
    } ,

}) ;

userSchema.pre('save',async function () {
    const genSalt = await bcryptjs.genSalt(10) ;
    this.password = await bcryptjs.hash(this.password,genSalt) ;
}) ; 

userSchema.methods.createJWT = function() {
    return jwt.sign({userId:this._id,name: this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME,}) ; 

};

userSchema.methods.comparePassword = async function(password) {
    const comparison = await bcryptjs.compare(password,this.password) ;
    return comparison ; 

}

module.exports = mongoose.model('User',userSchema) ; 