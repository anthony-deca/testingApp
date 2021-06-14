const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
	try {
		const db = await mongoose.connect("mongodb+srv://benarivo:reserpine@cluster0.8c0a9.mongodb.net/testApp?authSource=admin&replicaSet=atlas-e7uzou-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true",
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useFindAndModify: false,
			},
		);

		console.log(`MongoDB Connected: ${db.connection.host}`);
	} catch (err) {
		console.error(err);
		throw Error;
	}
};

module.exports = { connectDB }