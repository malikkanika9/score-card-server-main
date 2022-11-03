const JWT = require("jsonwebtoken");
const Config = require("../configuration/config");
const Cryptr = require("cryptr");
const adm = require("../models/adm");
const { result } = require("../configuration/dbConfig");
const cryptr = new Cryptr(Config.cryptR.secret);

AdmloginToken = (admin_data) => {
  return JWT.sign(
    {
      iss: "Reddys",
      sub: admin_data.id,
      name: admin_data.name,
      admin: true,
      iat: Math.round(new Date().getTime() / 1000),
      exp: Math.round(new Date().getTime() / 1000) + 24 * 60 * 60,
    },
    Config.jwt.secret
  );
};

module.exports = {
  handle_auth: async (req, res, next) => {
  
    if (Number.isInteger(req.user.id) && req.user.id > 0) {
      next();
    } else {
      let err_data = { password: "Invalid login details" };
      return res.status(401).json({ status: 2, errors: err_data });
    }
  },

  login: async (req, res, next) => {
    if (Number.isInteger(req.user.id) && req.user.id > 0) {
      let adm_data = {
        id: cryptr.encrypt(req.user.id),
        name: cryptr.encrypt(req.user.username),
        user_agent: cryptr.encrypt(req.get("User-Agent")),
      };
      const token = AdmloginToken(adm_data);

      res.status(200).json({ status: 1, token });
    } else {
      let err_data = { password: "Invalid login details" };
      return res.status(400).json({ status: 2, errors: err_data });
    }
  },

  result_data: async (req, res, next) => {
    console.log({req})
    try {
      let count = 0;
      
      const { studentInfo, result_part1 } =
        req.value;

        console.log({studentInfo})
      await adm.addStudentInfo(studentInfo).then(async (resp) => {
        console.log("resp", resp);
        let result_insert;
        for (let i = 0; i < result_part1.length; i++) {
          result_insert = await adm.addStudentResult(resp, result_part1[i]);
          console.log({result_insert})
          if (!result_insert.id) {
            count++;
          }
        }
        if (count > 0) {
          res
            .status(400)
            .json({
              status: 1,
              data: count,
            })
            .end();
        }else{
          res
            .status(200)
            .json({
              status: 1,
              data: result_insert,
            })
            .end();
        }
      });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json({
          status: 3,
          message: error,
        })
        .end();
    }
  },
  findStudent: async (req, res, next) => {
    // console.log(req.body)
		try {
			
			await adm
				.StudentResult()
				.then(function (data) {
					res
						.status(200)
						.json({
							status: 1,
							data: data,
						})
						.end();
				})
				.catch((err) => {
					console.log(err);
					res
						.status(400)
						.json({
							status: 3,
							message: err.message,
						})
						.end();
				});
		} catch (err) {
			console.log(err);
			res
				.status(400)
				.json({
					status: 3,
					message: err.message,
				})
				.end();
		}
	},
  
  findStudentbyidd: async (req, res, next) => {
		try {
			const studentid = req.params.id;
console.log("stuu",studentid)
			await adm
				.findByStudentId(studentid)
				.then(function (data) {
					res
						.status(200)
						.json({
							status: 1,
							data: data,
						})
						.end();
				})
				.catch((err) => {
					console.log(err);
					res
						.status(400)
						.json({
							status: 3,
							message: err.message,
						})
						.end();
				});
		} catch (err) {
			console.log(err);
			res
				.status(400)
				.json({
					status: 3,
					message: err.message,
				})
				.end();
		}
	},
  update_studentDetails: async (req, res, next) => {
    try {
      const id = req.params.id;
       console.log("stu_id in controllers:-", id);
       console.log("update_student_results body:-", req.body);
      const {
        sub,
        fa_num,
       ba_num,
       oral_num1,
       oral_num2,
      } = req.body;
       console.log("subject is:-", sub);
      const PreviousDetails = {
        sub: sub,
        fa_num:  fa_num,
        ba_num: ba_num,
        oral_num1: oral_num1,
        oral_num2: oral_num2,
      };
      await adm
        .update_student(id, PreviousDetails)
        .then(function (stu_details) {
  console.log("stu_details in controllers:-", stu_details);
          res
            .status(200)
            .json({
              status: 1,
              data: "data updated successfully !",
            })
            .end();
        })
        .catch((err) => {
          res
            .status(400)
            .json({
              status: 2,
              message: err.message,
            })
            .end();
        });
    } catch (err) {
      res
        .status(400)
        .json({
          status: 3,
          message: err.message,
        })
        .end();
    }
  },
  delete_student: async (req, res, next) => {
		try {
			const id = req.params.id;

			await adm
				.delete_student(id)
				.then(function (data) {
					res
						.status(200)
						.json({
							status: 1,
							message: 'User deleted',
						})
						.end();
				})
				.catch((err) => {
					console.log(err);
					res
						.status(400)
						.json({
							status: 3,
							message: err.message,
						})
						.end();
				});
		} catch (err) {
			console.log(err);
			res
				.status(400)
				.json({
					status: 3,
					message: err.message,
				})
				.end();
		}
	},

};
