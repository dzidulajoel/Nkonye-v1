import connectDB from "@/libs/db";
import { NextResponse, NextRequest } from "next/server";
import User from "@/libs/models/utilisateurs";
import bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
        try {
                await connectDB();
                const body = await req.json();
                const {
                        nom,
                        prenom,
                        email,
                        password,
                        phone,
                        country,
                        dateOfBirth,
                } = body;

                //verifier tous les champs
                if (!nom || !prenom || !email || !phone || !password || !dateOfBirth || !country) {
                        return NextResponse.json(
                                { success: false, message: "Tous les champs sont requis" }, { status: 400 });
                }

                // Vérifier si l'email existe déjà
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                        return NextResponse.json({
                                success: false,
                                message: "Cet email est déjà utilisé"
                        }, { status: 409 });
                }

                // Hash du mot de passe
                const hashedPassword = await bcrypt.hash(password, 12);

                // Créer le nouvel utilisateur
                const newUser = await User.create({
                        nom,
                        prenom,
                        email,
                        phone,
                        password: hashedPassword,
                        dateOfBirth,
                        country,
                        provider: "local",
                });

                // Retourner l'utilisateur sans le mot de passe
                const userResponse = {
                        _id: newUser._id,
                        nom: newUser.nom,
                        prenom: newUser.prenom,
                        email: newUser.email,
                        phone: newUser.phone,
                        country: newUser.country,
                        dateOfBirth: newUser.dateOfBirth,
                        createdAt: newUser.createdAt,
                };

                return NextResponse.json(
                        {
                                success: true,
                                data: userResponse,
                                message: "Creation du compte avec succes",
                        },
                        { status: 201 }
                );


        }
        catch (error) {
                console.error("Error in POST /api/users:", error);

                return NextResponse.json({
                        success: false,
                        message: "Internal Server Error"
                }, { status: 500 });

        }
}

