import { connectDB } from "@/lib/db";

import contract from "@/models/contract";
import { NextRequest } from "next/server";

export async function GET() {
  await connectDB();
  const contracts = await contract.find();
  return Response.json(contracts);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  const newContract = await contract.create(data);
  return Response.json(newContract);
}
