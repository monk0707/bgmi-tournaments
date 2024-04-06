const { instance } = require("../config/razorpay")
const Tournament = require("../models/Tournament")
const crypto = require("crypto")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const mongoose = require("mongoose")
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
// const CourseProgress = require("../models/CourseProgress")

// Capture the payment and initiate the Razorpay order

// const { contactUsEmail } = require("../mail/templates/contactFormRes")
require("dotenv").config()


exports.paybackRequestEmail = async (req, res) => {
  const { email, upiId,amount } = req.body

  const paymentEmail = process.env.PAYMENT_EMAIL

  console.log(req.body)
  
  try {

    // mail sent to the admins payment email for the processing of the payment : 

    const emailRes = await mailSender(
      paymentEmail,
      "User Wants to Withdraw Money",
      `Email Id - ${email} wants to withdraw ${amount} to UPI ID - ${upiId}`
    )

    // sent mail to the user that the request has been sent to the admin :

    const emailResUser = await mailSender(
      email,
      "Your Request has been sent",
      `Your request for withdrawal of ${amount} has been sent to the admin. Your money will be transferred to your UPI ID - ${upiId} within 3 days. Thanks for using our services.`
    )


    console.log("Email Res to admin ", emailRes)
    console.log("Email Res to user ", emailResUser)
    
    return res.json({
      success: true,
      message: "Email send successfully",
    })
  } catch (error) {
    console.log("Error", error)
    console.log("Error message :", error.message)
    return res.json({
      success: false,
      message: "Something went wrong...",
    })
  }
}




exports.updateWalletAfterTournament = async (req, res) => {

  try{
  const { data,tournamentId,killAmount} = req.body
  
  // ab aayega asli maja : 
  // to karna ye hai ki data ko split karo and ek array mai store kar lo and saare players enrolled nikaalo and unke wallet amount ko update kar do : 

  const userId = req.user.id;

    if (
      !data || !tournamentId || !killAmount
    ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      })
    }

    if (
      !userId
    ) {
      return res.status(403).send({
        success: false,
        message: "You are not logged in",
      })
    }

    const userDetails = await User.findById(
      { _id:userId }
    )

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User does not exists. Please sign in to continue.",
      })
    }

    // now find the tournament details : 
    const tournament = await Tournament.find({
       _id: tournamentId
    })
      .populate({
        path: "playersEnrolled",
        populate: {
          path: "additionalDetails",
        },
      })
      .exec()

    
    // now get the array of kills by splitting the data : 

    // what the fuck am I doing I need to do a lot of things fucking lot of things bro I wants the king status at any cost respect is everything for me , everything.
    
    const kills = data.split(",");
    console.log("kills array is ",kills);

    console.log("tournament details inside update wallet controller are ",tournament[0].playersEnrolled[0].email);

    tournament[0].playersEnrolled.map(async (player,index) => {
      console.log("player is ",player);
      // now let's update the wallet of the player : 
      const walletAmount = player.wallet;
      const updatedAmount = walletAmount + ((kills[index]-"")*killAmount);

      // now update this users wallet with updated amount : 
      const updatedWallet = await User.findByIdAndUpdate(
        {_id:player._id},
        {wallet:updatedAmount}
      )

      console.log("updated wallet is ",updatedWallet);
    })

    return res.json({
      success: true,
      message: "Wallet updated successfully",
    })

  }catch(error){
    console.log("Error", error)
    console.log("Error message :", error.message)
    return res.json({
      success: false,
      message: "Something went wrong... while updating the wallet after the tournament.",
    })
  }
}




exports.capturePayment = async (req, res) => {
  const { courses } = req.body
  const userId = req.user.id
  if (courses.length === 0) {
    return res.json({ success: false, message: "Please Provide Course ID" })
  }

  let total_amount = 0

  for (const course_id of courses) {
    let course
    try {
      // Find the course by its ID
      course = await Tournament.findById(course_id)

      // If the course is not found, return an error
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the tournament" })
      }

      // Check if the user is already enrolled in the course
      const uid = new mongoose.Types.ObjectId(userId)
      if (course.playersEnrolled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "player is already registered" })
      }

      // Add the price of the course to the total amount
      total_amount += course.registrationAmount
    } catch (error) {
      console.log(error)
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  }

  try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options)
    console.log(paymentResponse)
    res.json({
      success: true,
      data: paymentResponse,
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." })
  }
}

// verify the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature
  const courses = req.body?.courses

  const userId = req.user.id

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", `${process.env.RAZORPAY_SECRET}`)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res)
    return res.status(200).json({ success: true, message: "Payment Verified" })
  }

  return res.status(200).json({ success: false, message: "Payment Failed" })
}

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.userName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}

// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Course ID and User ID" })
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Tournament.findOneAndUpdate(
        { _id: courseId },
        { $push: { playersEnrolled: userId } },
        { new: true }
      )

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Tournament not found" })
      }

      console.log("Updated course: ", enrolledCourse)

      // const courseProgress = await CourseProgress.create({
      //   courseID: courseId,
      //   userId: userId,
      //   completedVideos: [],
      // })
      // Find the student and add the course to their list of enrolled courses
      const enrolledPlayer = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            tournaments: courseId,
            // courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      console.log("Enrolled student: ", enrolledPlayer)
      // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledPlayer.email,
        `Successfully Enrolled into ${enrolledCourse.title}`,
        courseEnrollmentEmail(
          enrolledCourse.title,
          `${enrolledPlayer.userName}`
        )
      )

      console.log("Email sent successfully: ", emailResponse.response)
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, error: error.message })
    }
  }
}


// const { instance } = require("../config/razorpay")
// // const Course = require("../models/Course")
// const crypto = require("crypto")
// const User = require("../models/User")
// const mailSender = require("../utils/mailSender")
// const mongoose = require("mongoose")
// require("dotenv").config()

// const {
//   courseEnrollmentEmail,
// } = require("../mail/templates/courseEnrollmentEmail")
// const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
// // const CourseProgress = require("../models/CourseProgress")

// // Capture the payment and initiate the Razorpay order
// exports.capturePayment = async (req, res) => {
//   const { total_amount } = req.body
//   const userId = req.user.id
// //   if (courses.length === 0) {
// //     return res.json({ success: false, message: "Please Provide Course ID" })
// //   }

// //   for (const course_id of courses) {
// //     let course
// //     try {
// //       // Find the course by its ID
// //       course = await Course.findById(course_id)

// //       // If the course is not found, return an error
// //       if (!course) {
// //         return res
// //           .status(200)
// //           .json({ success: false, message: "Could not find the Course" })
// //       }

// //       // Check if the user is already enrolled in the course
// //       const uid = new mongoose.Types.ObjectId(userId)
// //       if (course.studentsEnroled.includes(uid)) {
// //         return res
// //           .status(200)
// //           .json({ success: false, message: "Student is already Enrolled" })
// //       }

// //       // Add the price of the course to the total amount
// //       total_amount += course.price
// //     } catch (error) {
// //       console.log(error)
// //       return res.status(500).json({ success: false, message: error.message })
// //     }
// //   }

//   const options = {
//     amount: total_amount * 100,
//     currency: "INR",
//     receipt: Math.random(Date.now()).toString(),
//   }

//   try {
//     // Initiate the payment using Razorpay
//     const paymentResponse = await instance.orders.create(options)
//     console.log(paymentResponse)
//     res.json({
//       success: true,
//       data: paymentResponse,
//     })
//   } catch (error) {
//     console.log(error)
//     res
//       .status(500)
//       .json({ success: false, message: "Could not initiate order." })
//   }
// }

// // verify the payment
// exports.verifyPayment = async (req, res) => {
//   const razorpay_order_id = req.body?.razorpay_order_id
//   const razorpay_payment_id = req.body?.razorpay_payment_id
//   const razorpay_signature = req.body?.razorpay_signature
//   const amount = req.body;
// //   const courses = req.body?.courses

//   const userId = req.user.id

//   if (
//     !razorpay_order_id ||
//     !razorpay_payment_id ||
//     !razorpay_signature ||
//     // !courses ||
//     !userId
//   ) {
//     return res.status(200).json({ success: false, message: "Payment Failed" })
//   }

//   let body = razorpay_order_id + "|" + razorpay_payment_id

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_SECRET)
//     .update(body.toString())
//     .digest("hex")

//   if (expectedSignature === razorpay_signature) {
//     await updateInWallet(amount, userId, res)
//     return res.status(200).json({ success: true, message: "Payment Verified" })
//   }

//   return res.status(200).json({ success: false, message: "Payment Failed" })
// }

// // Send Payment Success Email
// exports.sendPaymentSuccessEmail = async (req, res) => {
//   const { orderId, paymentId, amount } = req.body

//   const userId = req.user.id

//   if (!orderId || !paymentId || !amount || !userId) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Please provide all the details" })
//   }

//   try {
//     const paymentUser = await User.findById(userId)

//     await mailSender(
//       paymentUser.email,
//       `Payment Received`,
//       paymentSuccessEmail(
//         `${paymentUser.firstName} ${paymentUser.lastName}`,
//         amount / 100,
//         orderId,
//         paymentId
//       )
//     )
//   } catch (error) {
//     console.log("error in sending mail", error)
//     return res
//       .status(400)
//       .json({ success: false, message: "Could not send email" })
//   }
// }

// // enroll the student in the courses
// const updateInWallet = async (amount, userId, res) => {
//   if (!amount || !userId) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Please Provide Course ID and User ID" })
//   }

//   // wallet mai amount update kar do and mail send kar do : 
//   const user = User.findById({_id:userId});
//   const walletId = user.wallet;
//   const Wallet = Wallet.findByIdAndUpdate(
//                                           {_id:walletId},
//                                           {amount:amount});
  
//   // send mail that the payment to wallet is completely done : 
  
//   const emailResponse = await mailSender(
//     user.email,
//     `Successfully Enrolled into ${enrolledCourse.courseName}`,
//     courseEnrollmentEmail(
//       `payment successfully done for ${amount} rs`,
//       `${user.userName}`
//     )
//   )

//   console.log("Email sent successfully: ", emailResponse.response)

// }

