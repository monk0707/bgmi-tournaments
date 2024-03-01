const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({

	bgmi_id1: {
		type: String,
        required: true,
	},
	bgmi_id2: {
		type: String,
        required: true,
	},
	bgmi_id3: {
		type: String,
        required: true,
	},
	bgmi_id4: {
		type: String,
        required: true,
	},

	user: {
		type: mongoose.Schema.Types.ObjectId,
        ref: "User",
	},

    tournament: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tournament"
    }
	
});

// Export the Profile model
module.exports = mongoose.model("Registration", registrationSchema);