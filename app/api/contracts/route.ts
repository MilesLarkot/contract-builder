import { connectDB } from "@/lib/db";

import contract from "@/models/contract";

export async function GET() {
  await connectDB();
  const contracts = await contract.find();
  return Response.json(contracts);
}

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();
  const newContract = await contract.create(data);
  return Response.json(newContract);
}
