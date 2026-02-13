import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { verifyPassword, generateToken, hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Seed a default admin user if no users exist
async function ensureAdminUser() {
  const db = await getDb();
  const usersCollection = db.collection("users");
  const count = await usersCollection.countDocuments();

  if (count === 0) {
    const hashedPassword = await hashPassword("admin123");
    await usersCollection.insertOne({
      id: "user_admin",
      email: "admin@traffic.com",
      name: "Admin User",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
    });
    console.log("Default admin user seeded: admin@traffic.com / admin123");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const usersCollection = db.collection("users");

    // Seed admin user if DB is empty
    await ensureAdminUser();

    // Find user in database
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
