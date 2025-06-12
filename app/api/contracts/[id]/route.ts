import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Contract from "@/models/contract";
import { Contract as ContractType } from "@/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const contract = await Contract.findById(params.id);
  return NextResponse.json(contract);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const data: Partial<ContractType> = await req.json();
  const updatedContract = await Contract.findByIdAndUpdate(params.id, data, {
    new: true,
  });
  return NextResponse.json(updatedContract);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Contract.findByIdAndDelete(params.id);
  return NextResponse.json({ msg: `rest in peace contract ${params.id}` });
}
