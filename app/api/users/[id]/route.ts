import connectDB from "@/libs/db";
import User from '@/libs/models/utilisateurs';
import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose";

// GET /api/users/:id → profil utilisateur
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
        try {
                await connectDB();

                const { id } = await params;

                // Validation du format ObjectId
                if (!mongoose.Types.ObjectId.isValid(id)) {
                        return NextResponse.json({
                                success: false,
                                message: "ID utilisateur invalide"
                        }, { status: 400 });
                }

                // Recherche de l'utilisateur par ID, en excluant le mot de passe
                const user = await User.findById(id).select('-password');

                // Vérification de l'existence de l'utilisateur
                if (!user) {
                        return NextResponse.json({
                                success: false,
                                message: "Utilisateur introuvable"
                        }, { status: 404 });
                }

                return NextResponse.json({
                        success: true,
                        data: user
                }, { status: 200 });

        } catch (error) {
                console.error("Error in GET /api/users/:id:", error);

                return NextResponse.json({
                        success: false,
                        message: "Internal Server Error"
                }, { status: 500 });
        }
}

// PATCH /api/users/:id → mise à jour profil
export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
        try {
                await connectDB();

                const { id } = await params;

                // Validation du format ObjectId
                if (!mongoose.Types.ObjectId.isValid(id)) {
                        return NextResponse.json({
                                success: false,
                                message: "ID utilisateur invalide"
                        }, { status: 400 });
                }

                // Récupération des données envoyées dans le corps de la requête
                const body = await req.json();

                // Liste des champs modifiables par l'utilisateur
                const allowedFields = [
                        'nom',
                        'prenom',
                        'phone',
                        'country',
                        'dateOfBirth',
                        'avatar'
                ];

                // Filtrage pour ne garder que les champs autorisés
                const updateData: any = {};
                Object.keys(body).forEach(key => {
                        if (allowedFields.includes(key)) {
                                updateData[key] = body[key];
                        }
                });

                // Vérification qu'il y a au moins un champ à mettre à jour
                if (Object.keys(updateData).length === 0) {
                        return NextResponse.json({
                                success: false,
                                message: "Aucune donnée valide à mettre à jour"
                        }, { status: 400 });
                }

                // Mise à jour de l'utilisateur avec les nouvelles données
                const updatedUser = await User.findByIdAndUpdate(
                        id,
                        updateData,
                        { new: true, runValidators: true }
                ).select('-password');

                // Vérification de l'existence de l'utilisateur
                if (!updatedUser) {
                        return NextResponse.json({
                                success: false,
                                message: "Utilisateur introuvable"
                        }, { status: 404 });
                }

                return NextResponse.json({
                        success: true,
                        message: "Profil mis à jour avec succès",
                        data: updatedUser
                }, { status: 200 });

        } catch (error) {
                console.error("Error in PATCH /api/users/:id:", error);

                return NextResponse.json({
                        success: false,
                        message: "Internal Server Error"
                }, { status: 500 });
        }
}

// DELETE /api/users/:id → suppression compte
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
        try {
                await connectDB();

                const { id } = await params;

                // Validation du format ObjectId
                if (!mongoose.Types.ObjectId.isValid(id)) {
                        return NextResponse.json({
                                success: false,
                                message: "ID utilisateur invalide"
                        }, { status: 400 });
                }

                // Suppression de l'utilisateur
                const deletedUser = await User.findByIdAndDelete(id);

                // Vérification de l'existence de l'utilisateur
                if (!deletedUser) {
                        return NextResponse.json({
                                success: false,
                                message: "Utilisateur introuvable"
                        }, { status: 404 });
                }

                return NextResponse.json({
                        success: true,
                        message: "Compte supprimé avec succès"
                }, { status: 200 });

        } catch (error) {
                console.error("Error in DELETE /api/users/:id:", error);

                return NextResponse.json({
                        success: false,
                        message: "Internal Server Error"
                }, { status: 500 });
        }
}