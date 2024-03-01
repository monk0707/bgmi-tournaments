// Import the required modules
const express = require("express")
const router = express.Router()
const {
  capturePayment,
  // verifySignature,
  verifyPayment,
  sendPaymentSuccessEmail,
} = require("../controllers/payments")
const { auth, isTeam, isUser, isAdmin } = require("../middleware/auth")
router.post("/capturePayment", auth, isUser, capturePayment)
router.post("/verifyPayment", auth, isUser, verifyPayment)
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isUser,
  sendPaymentSuccessEmail
)
// router.post("/verifySignature", verifySignature)

module.exports = router