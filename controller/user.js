const { loginWithOtp } = require("./login");
const { loginWithPassword } = require("./login");
const { verifyOTP } = require("./login");

module.exports = { loginWithOtp, loginWithPassword, verifyOTP };