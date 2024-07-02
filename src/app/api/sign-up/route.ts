import { sendVerificationEmail } from "@/helpers/sendVemail"; 
import { dbconnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// Connect to the database


export async function POST(request: NextRequest) {
    await dbconnect();
    try {
        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        const existingUserwithVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingUserwithVerifiedByUsername) {
            return NextResponse.json({ success: false, message: "Username is already taken" }, { status: 400 });
        }

        const existingUserByEmail = await UserModel.findOne({ email });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return NextResponse.json({ success: false, message: "User already exists with this email" }, { status: 400 });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date(Date.now() + 3600000);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });

            await newUser.save();
        }

        const emailRes = await sendVerificationEmail(
            email,
          username,
        verifyCode
        );

        if (!emailRes.success) {
            return NextResponse.json({ success: false, message: emailRes.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "User registered successfully" }, { status: 200 });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
