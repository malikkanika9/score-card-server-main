const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcryptjs");
const Cryptr = require('cryptr');
const Adm = require("./models/adm");
const Config = require("./configuration/config");
const cryptr = new Cryptr(Config.cryptR.secret);


isValidPassword = async function (newPassword, existiongPassword) {
  try {
    return await bcrypt.compare(newPassword, existiongPassword);
  } catch (error) {
    throw new Error(error);
  }
};

passport.use(
  "localAdm",
  new LocalStrategy(async (username, password, done) => {
    // console.log(username)
    try {
      const user = await Adm.findByUsername(username);
      // console.log("user", user)
      if (user.length > 0) {
        // console.log("password",password)
        const isMatch = await isValidPassword(password, user[0].password);
        // console.log(isMatch)
        if (!isMatch) {
          return done(null, { id: 0 });
        }
        done(null, user[0]);
      } else {
        return done(null, { id: 0 });
      }
    } catch (error) {
      done(error, false);
    }
  })
);

passport.use(
  "jwtAdm",
  new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: Config.jwt.secret,
  },
  async (payload,done)=>{
    try {
        // console.log(payload);
        if(!payload.admin){
            return done(null,{id:0})
        }

        if(!payload.sub){
            return done(null,{id:0})
        }

        if(!payload.name){
            return done(null,{id:0})
        }

        if(!payload.exp){
            return done(null,{id:0})
        }else{
            const current_time = Math.round(new Date().getTime() / 1000);
            if (current_time > payload.exp) {
                return done(null, { id: 0 });
            }
        }

        const user = await Adm.findByUsername(cryptr.decrypt(payload.name));
        console.log(user);
        if(user.length>0){
            // console.log("user[0]",user[0]);
			done(null, user[0]);

        }else{
            return done(null, { id: 0 });
        }

    } catch (error) {
        // console.log(error);
        return done(error,user[0]);
    }
  }
  
  )
);
