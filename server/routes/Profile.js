const express = require("express")
const router = express.Router()
const { auth, isTeam } = require("../middleware/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getRegisteredTournaments,
  teamDashboard,
} = require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
// We have to write the get registered tournaments controller:
router.get("/getRegisteredTournaments", auth, getRegisteredTournaments)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

router.get("/teamDashboard", auth, isTeam, teamDashboard)

module.exports = router