const mongoose = require("mongoose");
const walletSchema = new mongoose.Schema({
	amount: {
		type: Number,
		required: true,
	},
	// userDetails: {
	// 	type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
	// },
});

const OTP = mongoose.model("Wallet", walletSchema);
module.exports = OTP;