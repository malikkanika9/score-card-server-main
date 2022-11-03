const adm = require("../models/adm")

module.exports={
    validateDB:async(req,resp,next)=>{
        try {
           console.log("_req",req) 
        const {studentInfo} = req.value;
        // console.log("hjg",studenet_info)
        let err= {}

        let findStudenDetails =  await adm.findStudenDetails(studentInfo)
            console.log("findStudenDetails",findStudenDetails)

            if(findStudenDetails.success){
             return  resp.status(400).json({status:3,message:"Student already exist"})
            }else{
                console.log("before next")
                next()
            }

        } catch (error) {
            console.log(error)
            resp.status(400).json({status:3,message:error.message})
        }
    }
}