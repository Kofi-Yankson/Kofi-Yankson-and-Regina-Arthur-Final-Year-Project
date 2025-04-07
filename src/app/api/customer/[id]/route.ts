import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const id = context.params?.id;
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        name: body.name,
        location: body.location,
        latitude: body.latitude,
        longitude: body.longitude,
      },
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
