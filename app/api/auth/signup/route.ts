import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/connectPrisma";



export async function POST(req: NextRequest) {
  try {
    // Get data from request body
    const { name, email, password } = await req.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists by username or email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { name },
          { email }
        ]
      }
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    // In the existingUser check, change:
if (existingUser) {
  return NextResponse.json(
    { message: existingUser.name === name ? "Username already exists" : "Email already exists" },
    { status: 400 }
  );
}

// In the user creation, change:
const user = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword
  },
  // Only return safe fields
  select: {
    id: true,
    name: true,  // Changed from username to name
    email: true
  }
});

    return NextResponse.json(
      { message: "User created successfully", user }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}