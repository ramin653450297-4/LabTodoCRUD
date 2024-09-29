import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Task from '../../../models/todo';


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI as string);

export async function GET() {
  const tasks = await Task.find();
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newTask = new Task(body);
  await newTask.save();
  return NextResponse.json(newTask, { status: 201 });
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
  }

  const body = await req.json();
  const updatedTask = await Task.findByIdAndUpdate(id, body, { new: true });

  if (!updatedTask) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(updatedTask);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
  }

  await Task.findByIdAndDelete(id);
  return NextResponse.json({ message: "Task deleted" }, { status: 204 });
}
