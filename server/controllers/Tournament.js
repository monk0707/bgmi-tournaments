const Tournament = require("../models/Tournament")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const { convertSecondsToDuration } = require("../utils/secToDuration")
require("dotenv").config()

// Function to create a new course
exports.createTournament = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id

    // Get all required fields from request body
    let {
      title,
      tournamentNo,
      timeOfTournament,
      registrationAmount,
      tournamentPrize,
      tournamentSeatsLeft,
    } = req.body

    // Get thumbnail image from request files
    const thumbnail = req.files.thumbnail

    // Convert the tag and instructions from stringified Array to Array

    // Check if any of the required fields are missing
    if (
      !title ||
      !tournamentNo ||
      !timeOfTournament ||
      !registrationAmount ||
      !tournamentPrize ||
      !tournamentSeatsLeft
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      })
    }

    // Check if the user is a team member
    const teamDetails = await User.findById(userId, {
      accountType: "Team",
    })

    if (!teamDetails) {
      return res.status(404).json({
        success: false,
        message: "Team Details Not Found",
      })
    }

    // Check if the tag given is valid

    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      `${process.env.FOLDER_NAME}`
    )

    console.log(thumbnailImage)
    console.log(thumbnailImage.secure_url)
    // Create a new course with the given details
    const newTournament = await Tournament.create({
      title,
      tournamentNo,
      timeOfTournament,
      team:userId,
      registrationAmount,
      tournamentPrize,
      tournamentSeatsLeft,
      thumbnail: thumbnailImage.secure_url,
    })

    // Add the new tournament to the User Schema of the team

    await User.findByIdAndUpdate(
      {
        _id: teamDetails._id,
      },
      {
        $push: {
          tournaments: newTournament._id,
        },
      },
      { new: true }
    )
    // Add the new course to the Categories
    // const categoryDetails2 = await Category.findByIdAndUpdate(
    //   { _id: category },
    //   {
    //     $push: {
    //       courses: newCourse._id,
    //     },
    //   },
    //   { new: true }
    // )
    // console.log("HEREEEEEEEE", categoryDetails2)
    // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: newTournament,
      message: "Tournament Created Successfully",
    })

  } catch (error) {
    // Handle any errors that occur during the creation of the course
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to create Tournament",
      error: error.message,
    })
  }
}
// Edit Course Details
exports.editTournament = async (req, res) => {
  try {
    const { tournamentId } = req.body
    const updates = req.body
    const tournament = await Tournament.findById(tournamentId)

    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        `${process.env.FOLDER_NAME}`
      )
      tournament.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
          tournament[key] = updates[key]
      }
    }

    await tournament.save()

    // think here : 

    const updatedTounament = await Tournament.findOne({
      _id: tournamentId,
    })

    res.json({
      success: true,
      message: "Tournament updated successfully",
      data: updatedTounament,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// Get all Tournament Lists  
exports.getAllTournaments = async (req, res) => {
  try {
    const allTournaments = await Tournament.find(
      {},
      {
        title: true,
        tournamentNo: true,
        timeOfTournament: true,
        registrationAmount: true,
        tournamentPrize: true,
        tournamentSeatsLeft: true,
        thumbnail: true,
      }
    )
      .populate("team")
      .exec()

    return res.status(200).json({
      success: true,
      data: allTournaments,
    })

  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    })
  }
}
// Get One Single Course Details
// exports.getCourseDetails = async (req, res) => {
//   try {
//     const { courseId } = req.body
//     const courseDetails = await Course.findOne({
//       _id: courseId,
//     })
//       .populate({
//         path: "instructor",
//         populate: {
//           path: "additionalDetails",
//         },
//       })
//       .populate("category")
//       .populate("ratingAndReviews")
//       .populate({
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//         },
//       })
//       .exec()
//     // console.log(
//     //   "###################################### course details : ",
//     //   courseDetails,
//     //   courseId
//     // );
//     if (!courseDetails || !courseDetails.length) {
//       return res.status(400).json({
//         success: false,
//         message: `Could not find course with id: ${courseId}`,
//       })
//     }

//     if (courseDetails.status === "Draft") {
//       return res.status(403).json({
//         success: false,
//         message: `Accessing a draft course is forbidden`,
//       })
//     }

//     return res.status(200).json({
//       success: true,
//       data: courseDetails,
//     })
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// }
exports.getTournamentDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    // tournamentId.toObject();
    if(!courseId){
      return res.status(500).json({
        success: false,
        message: `Could not get tournament id`,
      })
    }
    console.log("tournament id is " , courseId)
    const tournamentDetails = await Tournament.find({
      _id: courseId,
    })
    .populate({
      path: "team",
      populate: {
        path: "additionalDetails",
      },
    })
    //  .populate("category")
    //  .populate("ratingAndReviews")
    //  .populate({
    //    path: "playersEnrolled",
    //    populate: {
    //      path: "additionalDetails",
    //     //  select: "-videoUrl",
    //    },
    //  })
    .exec()

      // Think about what we have to populate and how : 

    if (!tournamentDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find tournament with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    // let totalDurationInSeconds = 0
    // courseDetails.courseContent.forEach((content) => {
    //   content.subSection.forEach((subSection) => {
    //     const timeDurationInSeconds = parseInt(subSection.timeDuration)
    //     totalDurationInSeconds += timeDurationInSeconds
    //   })
    // })

    // const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        tournamentDetails,
      },
    })
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
exports.getFullTournamentDetails = async (req, res) => {

try {

    const { courseId } = req.body

    if(!courseId){
      return res.status(400).json({
        success: false,
        message: `Could not get tournament id : ${courseId}`,
      })
    }
    // const userId = req.user.id
    const tournamentDetails = await Tournament.find({
      _id: courseId,
    })
  .populate({
    path: "team",
    populate: {
      path: "additionalDetails",
    },
  })
  .populate({
    path: "playersEnrolled",
    populate: {
      path: "additionalDetails",
    },
  })
  .exec()

    console.log("tournament details inside edit tournament controller are ",tournamentDetails);

    if (!tournamentDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find tournament with id: ${courseId}`,
      })
    }

    return res.status(200).json({
      success: true,
      data: {
        tournamentDetails,
      },
    })
} catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
}
}
// Get a list of Course for a given Instructor
exports.getTeamTournaments = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const teamId = req.user.id
    // const teamId = req.body

    console.log("team id inside get team tournaments is ",teamId);

    // Find all courses belonging to the instructor
    const teamTournaments = await Tournament.find({
      team: teamId,
    })
    .populate({
      path: "playersEnrolled",
      populate: {
        path: "additionalDetails",
      },
    })
    .sort({ createdAt: -1 })
    .exec()

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: teamTournaments,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve team tournaments",
      error: error.message,
    })
  }
}
// Delete the Course
exports.deleteTournament = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const tournament = await Tournament.findById(courseId)

    console.log("tournament id inside delete tournament controller is ",courseId)
    console.log("tournament details inside delete tournament controller are ",tournament)

    if (!tournament) {
      return res.status(404).json({ message: "tournament not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = tournament.playersEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete the course
    await Tournament.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Tournament deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}