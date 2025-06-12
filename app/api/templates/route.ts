// import { connectDB } from "@/lib/db";

// import template from "@/models/template";

// export async function GET() {
//   await connectDB();
//   const templates = await template.find();
//   return Response.json(templates);
// }

// export async function POST(req: { json: () => any }) {
//   await connectDB();
//   const data = await req.json();
//   const newTemplate = await template.create(data);
//   return Response.json(newTemplate);
// }
