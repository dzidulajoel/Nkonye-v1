import User from "@/libs/models/utilisateurs";
import connectDB from "@/libs/db";

import bcrypt from "bcryptjs";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
        try {
                await connectDB();

                const body = await req.json();

                const { email, password } = body;

                if (!email || !password) {
                        return NextResponse.json({ success: false, message: "Tous les champs sont requis" }, {
                                status: 400,
                        });
                }

                // Vérifier si l'utilisateur existe
                const existingUser = await User.findOne({ email });

                if (!existingUser) {
                        return NextResponse.json({ success: false, message: "Cet utilisateur n'existe pas" }, {
                                status: 404,
                        });
                }

                // Vérification mot de passe
                const isPasswordCorrect = await bcrypt.compare(
                        password,
                        existingUser.password
                );

                if (!isPasswordCorrect) {
                        return NextResponse.json({ success: false, message: "Mot de passe incorrect" }, {
                                status: 401,
                        });
                }

                // Succès
                return NextResponse.json(
                        {
                                message: "Connexion réussie",
                                user: {
                                        id: existingUser._id,
                                        nom: existingUser.nom,
                                        prenom: existingUser.prenom,
                                        email: existingUser.email,
                                },
                        },
                        { status: 200 }
                );
        } catch (error) {
                console.log(error);
                return NextResponse.json({
                        success: false,
                        message: "Internal server error"
                }, { status: 500 });
        }
};
