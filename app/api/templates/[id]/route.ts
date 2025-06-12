import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Template from "@/models/template";
import { Contract as TemplateType } from "@/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const template = await Template.findById(params.id);
  return NextResponse.json(template);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const data: Partial<TemplateType> = await req.json();
  const updatedTemplate = await Template.findByIdAndUpdate(params.id, data, {
    new: true,
  });
  return NextResponse.json(updatedTemplate);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Template.findByIdAndDelete(params.id);
  return NextResponse.json({ msg: `rest in peace template ${params.id}` });
}
