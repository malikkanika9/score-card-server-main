const Joi = require('joi')
module.exports = {
    validateBody:(schema)=>{
        return (req,resp,next)=>{
			const {value,error}  = Joi.validate(req.body, schema, { abortEarly: false });
         if(error){
                let err_msg = {};
                for( let counter in error.details){
                    let k = error.details[counter].context.key;
                    let val = error.details[counter].message;
                    err_msg[k] = val;
                }
                let return_err = {status : 2 , errors:err_msg};
                return resp.status(400).json({return_err });

            }

            if(!req.value){
          req.value ={}
            }
			req.value['body'] = value;
            next();
        }
    },
    schemas:{
        authSchemas: Joi.object().keys({
            username: Joi.string().required().alphanum().min(4).max(12),
			password: Joi.string().required().min(4).max(12),
        })
    }
}