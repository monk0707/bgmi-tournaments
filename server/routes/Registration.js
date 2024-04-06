// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Registration Controllers Import
const {
    registerForTournament,
    registerNow,
    sendMail
} = require("../controllers/Registration")

// Importing Middlewares
const { auth, isTeam, isUser, isAdmin } = require("../middleware/auth")

// ********************************************************************************************************
//                                      Registration routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/registerForTournament", auth, isUser, registerForTournament)
router.post("/registerNow", auth, isUser, registerNow)

router.post("/sendMail", auth, isTeam, sendMail)
// Edit Course routes

module.exports = router