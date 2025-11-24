import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const kopiId = parseInt(id, 10);

    if (isNaN(kopiId)) {
      return NextResponse.json(
        { error: "ID tidak valid" },
        { status: 400 }
      );
    }

    const kopi = await prisma.kopi.findUnique({
      where: { id: kopiId },
    });

    if (!kopi) {
      return NextResponse.json(
        { error: "Kopi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(kopi);
  } catch (error) {
    console.error("Error fetching kopi:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kopi" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const kopiId = parseInt(id, 10);

    if (isNaN(kopiId)) {
      return NextResponse.json(
        { error: "ID tidak valid" },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (!body.nama || body.nama.trim() === "") {
      return NextResponse.json(
        { error: "Nama kopi harus diisi" },
        { status: 400 }
      );
    }

    const kopi = await prisma.kopi.findUnique({
      where: { id: kopiId },
    });

    if (!kopi) {
      return NextResponse.json(
        { error: "Kopi tidak ditemukan" },
        { status: 404 }
      );
    }

    const updatedKopi = await prisma.kopi.update({
      where: { id: kopiId },
      data: {
        nama: body.nama.trim(),
        notes: body.notes?.trim() || null,
        aroma: body.aroma?.trim() || null,
        acidity: body.acidity?.trim() || null,
        seduh: body.seduh?.trim() || null,
      },
    });

    return NextResponse.json(updatedKopi);
  } catch (error) {
    console.error("Error updating kopi:", error);

    const prismaError = error as { code?: string };
    
    if (prismaError.code === "P2002") {
      return NextResponse.json(
        { error: "Nama kopi sudah ada dalam database" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Gagal mengupdate kopi" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const kopiId = parseInt(id, 10);

    if (isNaN(kopiId)) {
      return NextResponse.json(
        { error: "ID tidak valid" },
        { status: 400 }
      );
    }

    const kopi = await prisma.kopi.findUnique({
      where: { id: kopiId },
    });

    if (!kopi) {
      return NextResponse.json(
        { error: "Kopi tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.kopi.delete({
      where: { id: kopiId },
    });

    return NextResponse.json(
      { message: "Kopi berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting kopi:", error);
    return NextResponse.json(
      { error: "Gagal menghapus kopi" },
      { status: 500 }
    );
  }
}
