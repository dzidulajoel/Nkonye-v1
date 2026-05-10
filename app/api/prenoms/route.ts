import connectDB from "@/libs/db"
import Prenoms from "@/libs/models/prenoms";
import { NextResponse , NextRequest} from "next/server";

// GET /api/prenoms → liste des prénoms (filtres: pays, sexe, origine)
export const GET = async (req: NextRequest) => {
        try {
                await connectDB();

                // Récupération des paramètres de requête pour les filtres
                const { searchParams } = new URL(req.url);
                const pays = searchParams.get('pays');
                const genre = searchParams.get('genre');
                const origine = searchParams.get('origine');
                const ethnie = searchParams.get('ethnie');
                const isVerified = searchParams.get('isVerified');
                const search = searchParams.get('search');

                // Construction du filtre de recherche
                const filter: any = {};

                if (pays) {
                        filter.pays = pays;
                }

                if (genre) {
                        filter.genre = genre;
                }

                if (origine) {
                        filter.origine = origine;
                }

                if (ethnie) {
                        filter.ethnie = ethnie;
                }

                if (isVerified !== null && isVerified !== undefined) {
                        filter.isVerified = isVerified === 'true';
                }

                // Recherche par nom de prénom (insensible à la casse)
                if (search) {
                        filter.prenom = { $regex: search, $options: 'i' };
                }

                // Récupération des prénoms avec filtres appliqués
                const prenoms = await Prenoms.find(filter)
                        .populate('createdBy.userId', 'nom prenom email')
                        .sort({ createdAt: -1 });

                return NextResponse.json({
                        success: true,
                        count: prenoms.length,
                        data: prenoms
                }, { status: 200 });

        } catch (error) {
                console.error("Error in GET /api/prenoms:", error);

                return NextResponse.json({
                        success: false,
                        message: "Internal Server Error"
                }, { status: 500 });
        }
}

// POST /api/prenoms → ajouter prénom (admin/contributeur)
export const POST = async (req: NextRequest) => {
        try {
                await connectDB();

                // Récupération des données envoyées
                const body = await req.json();

                // Validation des champs obligatoires
                if (!body.prenom) {
                        return NextResponse.json({
                                success: false,
                                message: "Le nom du prénom est obligatoire"
                        }, { status: 400 });
                }

                // Vérification si le prénom existe déjà
                const existingPrenom = await Prenoms.findOne({
                        prenom: { $regex: `^${body.prenom}$`, $options: 'i' }
                });

                if (existingPrenom) {
                        return NextResponse.json({
                                success: false,
                                message: "Ce prénom existe déjà"
                        }, { status: 409 });
                }

                // Création du nouveau prénom
                const newPrenom = await Prenoms.create({
                        prenom: body.prenom,
                        genre: body.genre || 'mixte',
                        origine: body.origine,
                        ethnie: body.ethnie,
                        pays: body.pays || [],
                        signification: body.signification || { fr: '', en: '' },
                        description: body.description || { fr: '', en: '' },
                        prononciation: body.prononciation || [],
                        isVerified: body.isVerified || false,
                        createdBy: body.createdBy || { userId: null, role: 'user' },
                        stats: {
                                likes: 0,
                                comments: 0,
                                shares: 0,
                                downloads: 0,
                                favorites: 0
                        }
                });

                return NextResponse.json({
                        success: true,
                        message: "Prénom ajouté avec succès",
                        data: newPrenom
                }, { status: 201 });

        } catch (error) {
                console.error("Error in POST /api/prenoms:", error);

                return NextResponse.json({
                        success: false,
                        message: "Internal Server Error"
                }, { status: 500 });
        }
}