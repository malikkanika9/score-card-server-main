const db = require('../configuration/dbConfig')

module.exports ={
    findByUsername: async(username)=>{
        return new Promise(function(resolve, reject) {
            db.any(
                "select id, username, password from  login where username=($1)",[username]
            )
            .then(function(result) { 
                // console.log("result",result);
                resolve(result);
             })
            .catch(function(err) { 
                // console.log("err",err);
                reject(err)
            })
        });


    },
    	findByAdminId: async (id) => {
		return new Promise(function (resolve, reject) {
			db.any("select * from login where id=($1) and status='1'", [id])
				.then(function (data) {
                    // console.log(data);
					resolve(data);

				})
				.catch(function (err) {
                    console.log(err);
					var errorText = common.getErrorText(err);
					var error = new Error(errorText);
					reject(error);
				});
		});
	},
    findStudenDetails: async(studenet_info)=>{
        console.log("inf",studenet_info)
        return new Promise((resolve,reject)=>{
            db.any("select * from student_info where classs =($1) and section=($2) and roll_num=($3) ",
            [
                studenet_info.classs,
                studenet_info.section,
                studenet_info.roll_num
            ]
            )
            .then(data=>{
                console.log({data})
                if(data.length > 0){
                    console.log(111111111)
                    resolve({success: true})
                }else{
                    console.log(2222222222)
                    resolve(false)
                }
            })
            .catch(err=>{
                console.log(333333333,err)
               reject(err)
            })
        })
    },

    addStudentInfo:async(student_data)=>{
        console.log("student_datastudent_data",student_data);
        return new Promise((resolve,reject)=>{
            db.one(
                "INSERT INTO student_info(stuName,classs,section,roll_num) VALUES ($1,$2,$3,$4) RETURNING stu_id",
                [
                    student_data.stuName,
                    student_data.classs,
                    student_data.section,
                    student_data.roll_num
                ]
            )
            .then(function (data) {
                console.log(data)
                resolve(data);
            })
            .catch(function (err) {
               console.log(err);
                reject(err);
            });
        })
    },


    addStudentResult:async(student_data,result_part1)=>{
        // console.log("result_part1", result_part1);
              return  new Promise((resolve,reject)=>{
                    db.one(
                        "INSERT INTO student_result(sub,FA_num,BA_num,Oral_num1,Oral_num2,stu_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id",
                        [
                           ( result_part1.sub).trim(),
                            result_part1.FA_num,
                            result_part1.BA_num,
                            result_part1.Oral_num1,
                            result_part1.Oral_num2,
                            student_data.stu_id
                    
                        ]
                    )
                    .then(function (data) {
                        console.log(data)
                        resolve(data);
                    })
                    .catch(function (err) {
                       console.log(err);
                        reject(err);
                    });
                })


    },

    StudentResult: async (id) => {
		return new Promise(function (resolve, reject) {
			db.any("select * from student_info ")
				.then(function (data) {
                     console.log(data);
					resolve(data);

				})
				.catch(function (err) {
                    console.log(err.message);
				
					reject(err.message);
				});
		});
	},
    findByStudentId: async (id) => {
		return new Promise(function (resolve, reject) {
			db.any("select * from student_result where stu_id=($1) ", [id])
				.then(function (data) {
                    // console.log(data)
					resolve(data);
				})
				.catch(function (err) {
                    console.log(err.message)
					reject(err.message);
				});
		});
	},

    update_student: async (id, PreviousDetails) => {
        return new Promise(function (resolve, reject) {
          db.result(
            "UPDATE student_result set sub=($1),fa_num=($2),ba_num=($3),oral_num1=($4),oral_num2=($5) where stu_id=($6)",
            [
              PreviousDetails.sub,
              PreviousDetails.fa_num,
              PreviousDetails.ba_num,
              PreviousDetails.oral_num1,
              PreviousDetails.oral_num2,
              id,
            ],
            (r) => r.rowCount
          )
            .then(function (data) {
              console.log("data in models:=", data);
              resolve(data);
            })
            .catch(function (err) {
              console.log("error in models:-", err.message);
              reject(err.message);
            });
        });
      },


    delete_student: async (id) => {
		return new Promise(function (resolve, reject) {
			db.result("delete from   student_info  where stu_id=($1)", [id], (r) => r.rowCount)
				.then(function (data) {
                    console.log(data)
					resolve(data);
				})
				.catch(function (err) {
					
				console.log(err)
					reject(err);
				});
		});
	},
}