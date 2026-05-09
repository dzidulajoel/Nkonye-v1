import connectDB from "@/libs/db";
import User from '@/libs/models/utilisateurs';
import {  NextResponse } from "next/server"

// GET /api/users → liste utilisateurs (admin)
export const GET = async () => {
        try {
                await connectDB();
                const users = await User.find({});
                return new NextResponse(JSON.stringify(users), {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                });
        }
        catch (error) {
                console.error("Error in GET /api/users:", error);

                return NextResponse.json({
                        success: false,
                        message: "Internal Server Error"
                }, { status: 500 });

        }
}
