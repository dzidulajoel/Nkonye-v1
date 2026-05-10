import Prenoms from '@/libs/models/prenoms';
import connectDB from "@/libs/db";
import mongoose from "mongoose";
import { NextResponse, NextRequest } from "next/server";

// GET /api/prenoms/:id → détail prénom
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
        try {
                await connectDB();

                const { id } = await params;

                // Validation du format ObjectId
                if (!mongoose.Types.ObjectId.isValid(id)) {
                        return NextResponse.json({
                                success: false,
                                message: "ID prénom invalide"
                        }, { status: 400 });
                }

                // Recherche du prénom par ID avec population du créateur
                const prenom = await Prenoms.findById(id)
                        .populate('createdBy.userId', 'nom prenom email avatar');

                // Vérification de l'existence du prénom
                if (!prenom) {
                        return NextResponse.json({
                                success: false,
                                message: "Prénom introuvable"
                        }, { status: 404 });
                }

                return NextResponse.json({
                        success: true,
                        data: prenom
                }, { status: 200 });

        } catch (error) {
                console.error("Error in GET /api/prenoms/:id:", error);

                return NextResponse.json({
                        success: false,
                        message: "Internal Server Error"
                }, { status: 500 });
        }
}

// PATCH /api/prenoms/:id → modifier prénom
export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
        try {
                await connectDB();

                const { id } = await params;

                // Validation du format ObjectId
                if (!mongoose.Types.ObjectId.isValid(id)) {
                        return NextResponse.json({
                                success: false,
                                message: "ID prénom invalide"
                        }, { status: 400 });
                }

                // Récupération des données à mettre à jour
                const body = await req.json();

                // Liste des champs modifiables
                const allowedFields = [
                        'prenom',
                        'genre',
                        'origine',
                        'ethnie',
                        'pays',
                        'signification',
                        'description',
                        'prononciation',
                        'isVerified'
                ];

                // Filtrage des champs autorisés
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

                // Mise à jour du prénom
                const updatedPrenom = await Prenoms.findByIdAndUpdate(
                        id,
                        updateData,
                        { new: true, runValidators: true }
                ).populate('createdBy.userId', 'nom prenom email');

                // Vérification de l'existence du prénom
                if (!updatedPrenom) {
                        return NextResponse.json({
                                success: false,
                                message: "Prénom introuvable"
                        }, { status: 404 });
                }

                return NextResponse.json({
                        success: true,
                        message: "Prénom mis à jour avec succès",
                        data: updatedPrenom
                }, { status: 200 });

        } catch (error) {
                console.error("Error in PATCH /api/prenoms/:id:", error);

                return NextResponse.json({
                        success: false,
                        message: "Internal Server Error"
                }, { status: 500 });
        }
}

// DELETE /api/prenoms/:id → supprimer prénom
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
        try {
                await connectDB();

                const { id } = await params;

                // Validation du format ObjectId
                if (!mongoose.Types.ObjectId.isValid(id)) {
                        return NextResponse.json({
                                success: false,
                                message: "ID prénom invalide"
                        }, { status: 400 });
                }

                // Suppression du prénom
                const deletedPrenom = await Prenoms.findByIdAndDelete(id);

                // Vérification de l'existence du prénom
                if (!deletedPrenom) {
                        return NextResponse.json({
                                success: false,
                                message: "Prénom introuvable"
                        }, { status: 404 });
                }

                return NextResponse.json({
                        success: true,
                        message: "Prénom supprimé avec succès"
                }, { status: 200 });

        } catch (error) {
                console.error("Error in DELETE /api/prenoms/:id:", error);

                return NextResponse.json({
                        success: false,
                        message: "Internal Server Error"
                }, { status: 500 });
        }
}

