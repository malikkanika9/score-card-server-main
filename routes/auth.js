const express = require("express");
const passport = require("passport");
const { dummyFunction } = require("../controllers/auth");
const { validateBody, schemas } = require("../helpers/admValidate");
const admController = require('../controllers/adm');

// const passportSignIn = passport.authenticate("localAdm",{session:false});
require("../passport");
const passportSignIn = passport.authenticate("localAdm", { session: false });

const router = express.Router();

router.get("/dummyapi", dummyFunction);
router.post("/login", validateBody(schemas.authSchemas), passportSignIn,admController.handle_auth, admController.login);


// router.post('/login',
// // (req,res,next)=>{
// //     console.log(req.body);

// // }
// //     validateBody(schemas.authSchemas)
// )

module.exports = router;
