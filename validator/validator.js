const {
  validarionerrorResponse,
  badRequestResponse,
  errorResponse,
} = require("../middleware/response");

const signUp = async (req, res, next) => {
  try {
    const {
      fullname,
      email,
      password,
      phoneno,
      gender,
      hobbies,
      Country,
      state,
      city,
      pincode,
    } = req.body;
    if (!fullname) {
      return validarionerrorResponse(res, { message: "fullname is required" });
    } else if (!email) {
      return validarionerrorResponse(res, { message: "email is required" });
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return validarionerrorResponse(res, {
        message: "You have entered an invalid email address!",
      });
    } else if (!password) {
      return validarionerrorResponse(res, { message: "password is required" });
    } else if (!phoneno) {
      return validarionerrorResponse(res, { message: "phoneno is required" });
    } else if (!gender) {
      return validarionerrorResponse(res, { message: "gender is required" });
    } else if (!hobbies) {
      return validarionerrorResponse(res, { message: "hobbies is required" });
    } else if (!Country) {
      return validarionerrorResponse(res, { message: "Country is required" });
    } else if (!state) {
      return validarionerrorResponse(res, { message: "state is required" });
    } else if (!city) {
      return validarionerrorResponse(res, { message: "city is required" });
    } else if (!pincode) {
      return validarionerrorResponse(res, { message: "pincode is required" });
    } else {
      next();
    }
  } catch (error) {
    return badRequestResponse(error, {
      message: "Failed to create register!",
    });
  }
};
const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return validarionerrorResponse(res, { message: "email is required" });
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return validarionerrorResponse(res, {
        message: "You have entered an invalid email address!",
      });
    } else if (!password) {
      return validarionerrorResponse(res, { message: "password is required" });
    } else {
      next();
    }
  } catch (error) {
    return errorResponse(error, { mess: "network error" });
  }
};
module.exports = { signUp, signIn };
