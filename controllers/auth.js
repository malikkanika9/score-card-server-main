const dummyFunction =  (req,resp,next)=>{
    console.log("object");
    resp.json("hello world!");
}

module.exports = {
    dummyFunction,
}