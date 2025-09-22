const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        // Use the MongoDB URI from environment or fallback to a default
        const mongoURI = process.env.MONGODB_URI || "mongodb+srv://inventory_db_user:30yslpW9zGYgPBL6@cluster0.taq14l1.mongodb.net/cfp_db"
        
        console.log("Attempting to connect to MongoDB...")
        console.log("MongoDB URI:", mongoURI ? "Set" : "Not set")
        
        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`)
        console.log(`Database: ${conn.connection.name}`)
    } catch (error) {
        console.error("Database connection error:", error)
        process.exit(1)
    }
}

module.exports = connectDB
