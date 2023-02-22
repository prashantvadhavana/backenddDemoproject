const nodemailer = require("nodemailer");
var ejs = require("ejs");
const {
  decodeUris,
  findOneRecord,
  cloneDeep,
  updateRecord,
  hardDeleteRecord,
} = require("../library/commonQueries");
const {
  successResponse,
  badRequestResponse,
  errorResponse,
  notFoundResponse,
} = require("../middleware/response");
const Usermodal = require("../models/user");
const {
  token,
  tokenverify,
  Forgetpasswordtoken,
} = require("../middleware/token");
const bcrypt = require("bcrypt");
const Token = require("../models/Token");
let transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "prashantvadhavana.vision@gmail.com",
    pass: "oplmmbixrxcuppub",
  },
});
exports.register = {
  signUp: async (req, res) => {
    try {
      req.body = decodeUris(req.body);
      const userdata = await findOneRecord(Usermodal, {
        email: req.body.email,
        isActive: !false,
      });
      if (userdata !== null) {
        return badRequestResponse(res, {
          message: "user is already exist.",
        });
      } else {
        const data = await findOneRecord(Usermodal, {
          email: req.body.email,
          isActive: false,
        });
        if (data !== null) {
          const accessToken = await token(Usermodal, data);
          const mailOptions = {
            from: "prashantvadhavana.vision@gmail.com", // Sender address
            to: data["email"], // List of recipients
            subject: "Node Mailer", // Subject line
            html: `http://localhost:8080/api/registration/signUp/varify:${accessToken.token}`,
          };
          transport.sendMail(mailOptions, async function (err, info) {
            if (err) {
              console.log("Email not send error something is wrong", err);
            } else {
              console.log("Email has been sent.d");
            }
          });
          badRequestResponse(res, {
            message: "palace check your mail and verify you mail address",
          });
        } else {
          const isCreated = await Usermodal(req.body).save();
          if (!isCreated) {
            return badRequestResponse(res, {
              message: "Failed to create register!",
            });
          } else {
            const accessToken = await token(Usermodal, isCreated);
            const mailOptions = {
              from: "prashantvadhavana.vision@gmail.com", // Sender address
              to: isCreated["email"], // List of recipients
              subject: "Node Mailer", // Subject line
              html: `http://localhost:8080/api/registration/signUp/varify:${accessToken.token}`,
            };
            transport.sendMail(mailOptions, async function (err, info) {
              if (err) {
                console.log("Email not send error something is wrong", err);
              } else {
                console.log("Email has been sent.d");
              }
            });
            successResponse(res, {
              message: "User created successfully",
              token: accessToken.token,
            });
          }
        }
      }
    } catch (error) {
      return errorResponse(error, res);
    }
  },
  mailVarify: async (req, res) => {
    try {
      const { Token } = req.params;
      if (Token) {
        let { err, decoded } = await tokenverify(Token.split(":")[1]);
        if (err) {
          notFoundResponse(res, {
            message: "user not found",
          });
        }
        if (decoded) {
          decoded = await cloneDeep(decoded);
          updateRecord(
            Usermodal,
            { email: decoded.profile.email },
            {
              isActive: true,
            }
          );
          res.redirect("http://exmple.com");
        }
      } else {
        badRequestResponse(res, {
          message: "No token provided.",
        });
      }
    } catch (error) {
      return errorResponse(error, res);
    }
  },
  signIn: async (req, res) => {
    try {
      req.body = decodeUris(req.body);
      const user = await findOneRecord(Usermodal, { email: req.body.email });
      if (!user) {
        notFoundResponse(res, { message: "User Not Found!" });
      } else {
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
          badRequestResponse(res, { message: "Password is incorrect!" });
        } else {
          if (!user.isActive) {
            badRequestResponse(res, {
              message: "Account is disabled. please contact support!",
            });
          } else {
            const accessToken = await token(Usermodal, user);
            successResponse(res, {
              message: "Login successfully",
              token: accessToken.token,
            });
          }
        }
      }
    } catch (error) {
      return errorResponse(error, res);
    }
  },
  forgotPassword: async (req, res) => {
    try {
      if (req.headers.authorization) {
        let { err, decoded } = await tokenverify(
          req.headers.authorization.split(" ")[1]
        );
        if (err) {
          notFoundResponse(res, {
            message: "user not found",
          });
        }
        if (decoded) {
          decoded = await cloneDeep(decoded);
          const accessToken = await Forgetpasswordtoken(
            Usermodal,
            decoded["profile"]
          );
          let token = await Token.findOne({ userId: decoded.profile._id });
          if (!token) {
            token = await new Token({
              userId: decoded.profile._id,
              token: accessToken.token,
            }).save();
          } else {
            await findOneRecord(
              Token,
              {
                userId: decoded.profile._id,
              },
              {
                token: accessToken.token,
              }
            )
          }
          ejs.renderFile(
            __dirname + "/Forgetpassword.ejs",
            {
              name: "prashantvadhvana@gmail.com",
              action_url: accessToken.token,
            },
            async function (err, data) {
              const mailOptions = {
                from: "prashantvadhavana.vision@gmail.com", // Sender address
                to: decoded["profile"]["email"], // List of recipients
                subject: "Node Mailer", // Subject line
                html: data,
              };
              await transport.sendMail(mailOptions, function (err, info) {
                if (err) {
                  return errorResponse(err, res);
                } else {
                  return successResponse(res, {
                    message: "mail send in your accouunt place check",
                  });
                }
              });
            }
          );
        }
      } else {
        badRequestResponse(res, {
          message: "No token provided.",
        });
      }
    } catch (error) {
      return errorResponse(error, res);
    }
  },
  changePassword: async (req, res) => {
    try {
      if (req.headers.authorization) {
        let { err, decoded } = await tokenverify(
          req.headers.authorization.split(" ")[1]
        );
        if (err) {
          notFoundResponse(res, {
            message: "user not found",
          });
        }
        if (decoded) {
          const { password } = req.body;
          decoded = await cloneDeep(decoded);
          await hardDeleteRecord(Token, {
            userId: decoded.profile._id,
          });
          await bcrypt.hash(password, 8).then((pass) => {
            updateRecord(
              Usermodal,
              { email: decoded.profile.email },
              {
                password: pass,
              }
            );
            return successResponse(res, {
              message: "mail send in your accouunt place check",
              data: decoded,
            });
          });
        }
      } else {
        badRequestResponse(res, {
          message: "No token provided.",
        });
      }
    } catch (error) {
      return errorResponse(error, res);
    }
  },
};
