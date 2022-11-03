const express = require("express");
const cors = require("cors");
// const pool = require("./configuration/dbConfig");
const authRouter = require("./routes/auth")
const studentRouter = require("./routes/stud_details")
const app = express();
require("./configuration/dbConfig.js")

app.use(express.json());
app.use(cors({ origin:true, credentials:true }));


const port = 8000;

app.use("/api/auth",authRouter)
app.use("/api/student",studentRouter);

app.listen(port, function (err) {
  if (err) {
    console.log("Error while starting server");
  } else {
    console.log("Server has been started at " + port);
  }
});

