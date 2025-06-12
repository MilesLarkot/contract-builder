import { connectDB } from "@/lib/db";
import Template from "@/models/template";

export async function GET(_: any, { params }: any) {
  await connectDB();
  const template = await Template.findById(params.id);
  return Response.json(template);
}

export async function PATCH(req: { json: () => any }, { params }: any) {
  await connectDB();
  const data = await req.json();
  const updatedTemplate = await Template.findByIdAndUpdate(params.id, data, {
    new: true,
  });
  return Response.json(updatedTemplate);
}

export async function DELETE(_: any, { params }: any) {
  await connectDB();
  await Template.findByIdAndDelete(params.id);
  return Response.json({ msg: "rest in peace template " + params.id });
}
