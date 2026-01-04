const Job = require('../models/Job') ;
const {NotFoundError,BadRequestError} = require('../errors') ;
const {StatusCodes} = require('http-status-codes') ; 

const getAllJobs = async (req,res) => {
    const jobs = await Job.find({createdBy:req.user.userId}) ;
    res.status(StatusCodes.OK).json({jobs,Count: jobs.length}) ; 

};

const getSingleJob = async (req,res) => {
    const {user:{userId},params:{id: jobid}} = req ;
    const job = await Job.findOne({_id:jobid,createdBy:userId}) ;
    if(!job) {
        throw new NotFoundError(`Job with this ${jobid} does not exist`) ;
    }
    res.status(StatusCodes.OK).json({job})
};

const createJob = async (req,res) => {
    req.body.createdBy = req.user.userId ;
    const job = await Job.create(req.body) ;
    res.status(StatusCodes.CREATED).json({job}) ; 
};

const updateJob = async (req,res) => {
    const {user:{userId},params:{id:jobid},body:{company,position}} = req ;
    if(!company || !position) {
        throw new BadRequestError(`Please provide company and position to update job`) ; 
    }
    const job = await Job.findOneAndUpdate({_id:jobid,createdBy:userId},req.body,{new:true,runValidators:true}) ;
    if(!job) {
        throw new NotFoundError(`Job with the id ${jobid} does not exist`) ;
    }
    res.status(StatusCodes.OK).json({job}) ; 
};

const deleteJob = async (req,res) => {
    const {user:{userId},params:{id:jobid}} = req ; 
    const job = await Job.findByIdAndRemove({_id:jobid,createdBy:userId}) ;
    if(!job) {
        throw new NotFoundError(`Job with the id ${jobid} does not exist`) ;
    }
    res.status(StatusCodes.OK).send() ; 

}; 

module.exports = {getAllJobs,getSingleJob,createJob,updateJob,deleteJob};   