import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password, location } = await req.json();

    // Check if email already exists
    const existingAccount = await prisma.customerAccount.findUnique({
      where: { email },
    });

    if (existingAccount) {
      return NextResponse.json({ error: "Email is already in use." }, { status: 400 });
    }

    // Create a new customer
    const customer = await prisma.customer.create({
      data: {
        name,
        location,
        latitude: 5.7744, // Default location (Academic City)
        longitude: -0.2133,
      },
    });

    // Create associated account
    await prisma.customerAccount.create({
      data: {
        email,
        password, // WARNING: Plain text password, should be encrypted in the future
        customerId: customer.id,
      },
    });

    return NextResponse.json({ message: "Registration successful!" }, { status: 201 });
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
