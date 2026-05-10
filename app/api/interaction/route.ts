import connectDB from "@/libs/db";
import Interaction from "@/libs/models/Interaction";
import Prenoms from "@/libs/models/prenoms";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
        const session = await mongoose.startSession();

        try {
                await connectDB();

                const body = await req.json();
                const { prenomId, userId, type } = body;

                if (!prenomId || !userId || !type) {
                        return NextResponse.json(
                                {
                                        success: false,
                                        message: "prenomId, userId et type sont obligatoires",
                                },
                                { status: 400 }
                        );
                }

                if (
                        !mongoose.Types.ObjectId.isValid(prenomId) ||
                        !mongoose.Types.ObjectId.isValid(userId)
                ) {
                        return NextResponse.json(
                                {
                                        success: false,
                                        message: "Format d'ID invalide",
                                },
                                { status: 400 }
                        );
                }

                session.startTransaction();

                const statField = `stats.${type}s`;

                const existingInteraction = await Interaction.findOne({
                        prenomId,
                        userId,
                        type,
                }).session(session);

                let action: string;
                let interaction: any;

                if (existingInteraction) {
                        //  REMOVE LIKE
                        await Interaction.deleteOne(
                                { _id: existingInteraction._id },
                                { session }
                        );

                        await Prenoms.findByIdAndUpdate(
                                prenomId,
                                { $inc: { [statField]: -1 } },
                                { session }
                        );

                        action = "removed";
                        interaction = null;
                } else {
                        // ADD LIKE
                        interaction = await Interaction.create(
                                [
                                        {
                                                prenomId,
                                                userId,
                                                type,
                                        },
                                ],
                                { session }
                        );

                        await Prenoms.findByIdAndUpdate(
                                prenomId,
                                { $inc: { [statField]: 1 } },
                                { session }
                        );

                        action = "added";
                }

                const updatedPrenom = await Prenoms.findById(prenomId).session(session);

                await session.commitTransaction();

                return NextResponse.json(
                        {
                                success: true,
                                message:
                                        action === "added"
                                                ? "Interaction ajoutée"
                                                : "Interaction retirée",
                                data: {
                                        action,
                                        interaction,
                                        stats: updatedPrenom?.stats,
                                },
                        },
                        { status: 200 }
                );
        } catch (error) {
                await session.abortTransaction();

                console.error("Error in toggle interaction:", error);

                return NextResponse.json(
                        {
                                success: false,
                                message: "Internal Server Error",
                        },
                        { status: 500 }
                );
        } finally {
                session.endSession();
        }
};