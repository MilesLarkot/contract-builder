// import { connectDB } from "@/lib/db";

// import section from "@/models/section";

// export async function GET() {
//   await connectDB();
//   const sections = await section.find();
//   return Response.json(sections);
// }

// export async function POST(req: { json: () => any }) {
//   await connectDB();
//   const data = await req.json();
//   const newSection = await section.create(data);
//   return Response.json(newSection);
// }
