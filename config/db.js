const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI}/MERN_LOGIN`)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }catch(error){
        console.log(`Connection Error: ${error.message}`);
        process.exit(1);
    }
}
module.exports = connectDB