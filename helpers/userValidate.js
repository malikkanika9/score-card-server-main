const { join } = require('bluebird');
const Joi = require('joi');
const { as } = require('pg-promise');

module.exports = {
    validateBody: (schema)=>{
        return (req,res,next)=>{
            const {value,error}= Joi.validate(req.body, schema, { abortEarly: false });
         
            // console.log("value",value);
            // if(value){
                //     console.log(value);
                // }else{
                    //     console.log(error);
                    // }
                    // console.log(value);
                    // console.log("first")
            if(error){
                let err_msg = {};
                for( let counter in error.details){
                    let k = error.details[counter].context.key;
                    let val = error.details[counter].message;
                    err_msg[k] = val;
                }
                let return_err = {status : 2 , errors:err_msg};
                console.log("er",err_msg)
                return res.status(400).json({return_err });
            }

            // console.log(req.value);
            if(!req.value){
                req.value={}
            }
            req.value=value;
            // console.log("req.value",req.value.studenet_info);
            // let findStudenDetails = await 
            // let err={}

           

            next();

        }
    },

    schemas:{
        userSchema: Joi.object().keys({
            studentInfo: Joi.object().keys({
                stuName: Joi.string().required().alphanum(),
                classs: Joi.number().integer().required(),
                section: Joi.string().required(),
                roll_num: Joi.number().required()
               
               
            }),
            result_part1: Joi.array().items(
                Joi.object().keys({
                    sub: Joi.string().required(),
                    FA_num: Joi.number().integer().required(),
                    BA_num: Joi.number().integer().required(),
                    Oral_num1: Joi.number().integer().required(),
                    Oral_num2: Joi.number().integer().required(),
                    id: Joi.number().required()

                })
            ).min(2).required(),
            }),

            delete_student: Joi.object().keys({
                id: Joi.number().required(),
            }),
          
            
    }
}



