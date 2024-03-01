// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
    createTournament,
    getAllTournaments,
    getTournamentDetails,
    editTournament,
    getTeamTournaments,
    deleteTournament,
    getFullTournamentDetails,
} = require("../controllers/Tournament")

// Importing Middlewares
const { auth, isTeam, isUser, isAdmin } = require("../middleware/auth")

// ********************************************************************************************************
//                                      Team routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createTournament", auth, isTeam, createTournament)
// Edit Course routes
router.post("/editTournament", auth, isTeam, editTournament)

// Get all Courses Under a Specific Instructor
router.get("/getTeamTournaments", auth, isTeam, getTeamTournaments)
// Get all Registered Courses
router.get("/getAllTournaments", getAllTournaments)
// Get Details for a Specific Courses
router.post("/getTournamentDetails", getTournamentDetails)
// get full tournament details to edit : 
router.post("/getFullTournamentDetails", getFullTournamentDetails)
// To get Course Progress
// router.post("/getProgressPercentage", auth, isStudent, getProgressPercentage)
// Delete a Course
router.delete("/deleteTournament", deleteTournament)


module.exports = router