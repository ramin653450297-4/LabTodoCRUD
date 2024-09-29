import { connectToDatabase } from "@/lib/mongodb";
import Todo from "@/models/todo";
import { NextRequest, NextResponse } from "next/server";

// READ data
export async function GET() {
  try {
    await connectToDatabase();
    const todoResult = await Todo.find({});
    return NextResponse.json({ data: todoResult });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || "Something went wrong" });
  }
}

// Create new record
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await Todo.create(body);
    return NextResponse.json({ data: res });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Something went wrong" });
  }
}

// Update
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { _id, ...updateData } = body; // แยก _id ออกจากข้อมูลที่อัปเดต
    const res = await Todo.findByIdAndUpdate(_id, updateData, { new: true }); // คืนค่าข้อมูลใหม่หลังอัปเดต
    return NextResponse.json({ data: res });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Something went wrong" });
  }
}

// Delete
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await Todo.findByIdAndDelete(body._id); // ใช้ _id เพื่อระบุ Todo ที่ต้องการลบ
    return NextResponse.json({ data: res });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Something went wrong" });
  }
}
