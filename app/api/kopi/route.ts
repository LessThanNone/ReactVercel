import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const kopiList = await prisma.kopi.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(kopiList);
  } catch (error) {
    console.error("Error fetching kopi:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kopi" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.nama || body.nama.trim() === "") {
      return NextResponse.json(
        { error: "Nama kopi harus diisi" },
        { status: 400 }
      );
    }

    const newKopi = await prisma.kopi.create({
      data: {
        nama: body.nama.trim(),
        notes: body.notes?.trim() || null,
        aroma: body.aroma?.trim() || null,
        acidity: body.acidity?.trim() || null,
        seduh: body.seduh?.trim() || null,
      },
    });

    return NextResponse.json(newKopi, { status: 201 });
  } catch (error) {
    console.error("Error creating kopi:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));

    const prismaError = error as { code?: string; message?: string; stack?: string };
    
    if (prismaError.code === "P2002") {
      return NextResponse.json(
        { error: "Nama kopi sudah ada dalam database" },
        { status: 400 }
      );
    }

    const errorMessage = prismaError.message || "Gagal menambah kopi";
    return NextResponse.json(
      { 
        error: errorMessage,
        code: prismaError.code || "UNKNOWN_ERROR",
        details: process.env.NODE_ENV === "development" ? prismaError.stack : undefined
      },
      { status: 500 }
    );
  }
}
