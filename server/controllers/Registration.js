
const User = require("../models/User")
const mongoose = require('mongoose');

const Tournament = require("../models/Tournament");
const Registration = require("../models/Registration");

require("dotenv").config()

// Signup Controller for Registering Users

exports.registerForTournament = async (req, res) => {
  try {
    // Destructure fields from the request body
    const {
      tournamentId,
      bgmi_id1,
      bgmi_id2,
      bgmi_id3,
      bgmi_id4,
    } = req.body

    // Check if All Details are there or not
    const userId = req.user.id;

    if (
      !tournamentId||
      !bgmi_id1 ||
      !bgmi_id2 ||
      !bgmi_id3 ||
      !bgmi_id4
    ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      })
    }

    const userDetails = await User.findOne({ _id:userId })
    const walletId = userDetails.wallet
    const wallet = Wallet.findById({_id:walletId})
    const walletBalance = wallet.amount

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User does not exists. Please sign in to continue.",
      })
    }

    // check for wallet money 
    const tournament = Tournament.findOne({_id: tournamentId});

    //  now find the money needed for registration : 
    const amountForRegistration = tournament.registrationAmount

    // now check the balance in wallet 
    // const walletBalance =            find out how this query will be executed :          // To do :
    // const walletBalance = 1000

    // let's apply the condition on wallet balance vs tournament registration amount
    if(walletBalance>=amountForRegistration){
        // to registration successfully kar do : that is create entry in Registration model,
        const newRegistration = await Registration.create({
            bgmi_id1,
            bgmi_id2,
            bgmi_id3,
            bgmi_id4,
            user: userId,
            tournament: tournament._id,
          })
    }

    const balanceInWalletLeft = walletBalance-amountForRegistration

    // cut the amount of registration from the wallet : 
    await Wallet.findByIdAndUpdate(
                                    {_id:walletId},
                                    {amount:balanceInWalletLeft }
    )

    // add the user into the registration model : // done

    // // // ab kya karna hai : registration kisi mai push karna hai kya ?  Tournament mai registration push kar do : 

    await Tournament.findByIdAndUpdate(
        {
          _id: tournament._id,
        },
        {
          $push: {
            playersEnrolled: newRegistration._id,
          },
        },
        { new: true }
    )

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    })
    
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    })
  }
}



//          REGISTER NOW           //




exports.registerNow = async (req, res) => {
  try {
    // Destructure fields from the request body
    const {
      upiId,
      courseId
    } = req.body

    // courseId = courseId.toObject();
    // Check if All Details are there or not
    const userId = req.user.id;

    console.log("course Id and upi id and user id inside register now controller is ",courseId," ",upiId," ",userId);

    if (
      !upiId || !courseId
    ) {
      return res.status(403).send({
        success: false,
        message: "This Field is required",
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

    // Check if the user is already enrolled in the course
    
    const uid = new mongoose.Types.ObjectId(userId)

    console.log('uid after converting to object id is ',uid)
    // console.log('tournament is = ',Tournament," players enrolled are ",Tournament?.playersEnrolled);

    const tournDetails = await Tournament.findById(
      {
        _id: courseId,
      }
    )

    if (tournDetails?.playersEnrolled?.includes(uid)) {
      return res
        .status(200)
        .json({ success: false, message: "player is already registered" })
    }
    

    // console.log("type of (seats left for the tournament) are ",typeof(tournDetails.tournamentSeatsLeft));
    

    // checking if seats in the tournament are left or not : 
    if(tournDetails.tournamentSeatsLeft=="0"){
      return res
        .status(400)
        .json({ success: false, message: "Seats are full for the tournament!" })
    }

    const userDetails = await User.findByIdAndUpdate(
      { _id:userId },
      {paymentId: upiId}
      )

    // userDetails.paymentId = upiId;

    await Tournament.findByIdAndUpdate(
      {
        _id: courseId,
      },
      {
        $push: {
          playersEnrolled: userId,
        },
      },
      { new: true }
    ).exec()


    const tournamentDetails = await Tournament.findByIdAndUpdate(
      {
        _id: courseId,
      },
      {
        tournamentSeatsLeft: (tournDetails.tournamentSeatsLeft - "1"),
      },
      {new: true}
    ).exec()


    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User does not exists. Please sign in to continue.",
      })
    }

    // pushing the registered tournament into user : 
    
    await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        $push: {
          tournaments: courseId,
        },
      },
      { new: true }
    ).exec()

    // decrease the seats left in the tournament by 1 : 

    return res.status(200).json({
      success: true,
      userDetails,tournamentDetails,
      message: "User registered successfully for the tournament",
    })
    
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "User cannot be registered for the tournament. Please try again.",
    })
  }
}

