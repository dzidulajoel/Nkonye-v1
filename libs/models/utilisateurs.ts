import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
        {
                // 👤 identité utilisateur
                nom: {
                        type: String,
                        required: true,
                        trim: true,
                },
                prenom: {
                        type: String,
                        required: true,
                        trim: true,
                },
                // 📧 email principal (login + communication)
                email: {
                        type: String,
                        unique: true,
                        required: true,
                        index: true,
                        lowercase: true,
                        trim: true,
                        match: [/^\S+@\S+\.\S+$/, "Email invalide"],
                },
                // 🔐 mot de passe (uniquement si login local)
                password: {
                        type: String,
                        length: 8,
                        required: function () {
                                return this.provider === "local";
                        },
                        default: null,
                },
                // 📱 infos optionnelles utilisateur
                phone: { type: String, default: null },
                country: { type: String, default: null },
                dateOfBirth: { type: Date, default: null },
                avatar: { type: String, default: null },
                // 🔑 type d'authentification
                provider: { type: String, enum: ["local", "google", "facebook"], default: "local",},
                // 🆔 id du provider (google/facebook)
                providerId: { type: String, default: null },
                isVerified: {
                        type: Boolean,
                        default: false,
                },
                emailVerificationToken: { type: String, default: null },
                emailVerificationExpires: { type: Date, default: null },
                resetPasswordToken: { type: String, default: null },
                resetPasswordExpires: { type: Date, default: null },

                role: {
                        type: String,
                        enum: ["user", "admin"],
                        default: "user",
                },
        },
        {
                timestamps: true, // createdAt + updatedAt
        }
);



// 📇 Index composé pour recherches provider
userSchema.index({ provider: 1, providerId: 1 });

export default mongoose.models.User || mongoose.model("User", userSchema);