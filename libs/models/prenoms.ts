import mongoose from "mongoose";

const prenomsSchema = new mongoose.Schema(
        {
                prenom: { type: String, required: true, trim: true, index: true },
                genre: { type: String, enum: ["masculin", "feminin", "mixte"] },
                origine: String,
                ethnie: String,
                pays: [String],
                signification: {fr: String,en: String},
                description: {fr: String,en: String},
                prononciation: [String],
                isVerified: { type: Boolean, default: false },
                createdBy: {
                        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                        role: String
                },
                stats: {
                        likes: { type: Number, default: 0 },
                        comments: { type: Number, default: 0 },
                        shares: { type: Number, default: 0 },
                        downloads: { type: Number, default: 0 },
                        favorites: { type: Number, default: 0 }
                }
        },
        { timestamps: true }
);

export default mongoose.models.Prenoms || mongoose.model("Prenoms", prenomsSchema);