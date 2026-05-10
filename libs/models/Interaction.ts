import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema(
        {
                prenomId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Prenoms",
                        required: true,
                        index: true
                },

                userId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                        required: true,
                        index: true
                },

                type: {
                        type: String,
                        enum: ["like", "share", "download", "favorite"],
                        required: true,
                        index: true
                }
        },
        { timestamps: true }
);

interactionSchema.index(
        { prenomId: 1, userId: 1, type: 1 },
        { unique: true }
);

export default mongoose.models.Interaction || mongoose.model("Interaction", interactionSchema);