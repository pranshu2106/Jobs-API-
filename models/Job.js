const { required } = require('joi');
const mongoose = require('mongoose') ;

const JobsSchema = new mongoose.Schema({
    company:{
        type:String,
        required:[true,'Please Provide Company Name'],
        maxlength:50
    } ,
    position:{
        type:String,
        required:[true,'Please Provide Position']
    },
    status:{
        type:String,
        enum:['interviewed','pending','declined'],
        default:'pending'
    } ,
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'Please Provide User']
    }
    
},{timestamps:true}) ;

module.exports = mongoose.model('Job',JobsSchema) ; 

