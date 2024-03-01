const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({

    title: {
        type: String,
    },

	tournamentNo: {
		type: String,
	},

    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    playersEnrolled: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
    ],

	timeOfTournament: {
		type : String,
	},

    createdAt: {
        type: Date,
        default: Date.now,
    },

    registrationAmount: {
        type: Number,
    },

    tournamentPrize: {
        type: String,
    },

    tournamentSeatsLeft: {
        type : String,
    },

    thumbnail: {
        type: String,
    },

});

// Export the Profile model
module.exports = mongoose.model("Tournament", tournamentSchema);