import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_CONNECTION,{
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        console.log(`🚀 MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    }catch (error) {
        console.error(`❗Error: ${error.message}`.red.underline.bold);
    }
}
export default connectDB