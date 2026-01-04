const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg : err.message || 'Something Went Wrong, Try again'
  }
  
  if(err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors).map((items)=>items.message).join(',');
    customError.statusCode = 400 ; 
  }

  if(err.name === 'CastError') {
    customError.msg = `No job with this ${err.value} id` ;
    customError.statusCode = 404 ; 
  }


  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} please choose another value`;
  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(customError.statusCode).json({ msg: customError.msg });
  // }
    
  // return res.status(err.statusCode).json({msg:err.msg}) ; 
  return res.status(customError.statusCode).json({ msg: customError.msg });
}

module.exports = errorHandlerMiddleware; 
