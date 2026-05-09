import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
        try {
                if (mongoose.connection.readyState >= 1) {
                        return;
                }

                await mongoose.connect(MONGODB_URI!, {
                        dbName:"nkonye-v1",
                        bufferCommands:true
                });
                console.log("✅ MongoDB connecté");
        } catch (error) {
                console.error("❌ Erreur de connexion MongoDB:", error);
                throw error;
        }
};

export default connectDB;