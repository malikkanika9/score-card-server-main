const express = require('express');
const { Client } = require('pg');
const passport = require('passport');
const admController = require('../controllers/adm');
const { validateBody, schemas } = require('../helpers/userValidate');
const { validateDB } = require('../helpers/userdbValidate');
require('../passport');
const passportJWT = passport.authenticate('jwtAdm', { session: false });

const router = express.Router();
// console.log(router);

router.post('/details', passportJWT, admController.handle_auth, validateBody(schemas.userSchema), validateDB, admController.result_data);

router.get('/getstudent', passportJWT, admController.handle_auth, admController.findStudent);

router.get('/getstudent/:id', passportJWT, admController.handle_auth, admController.findStudentbyidd);

router.put('/update/:id',

		passportJWT,
		admController.handle_auth,
		admController.update_studentDetails
);

router.delete('/:id',
	
		passportJWT,
		admController.handle_auth,
		admController.delete_student
	);
module.exports = router;
