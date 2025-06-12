// import { connectDB } from "@/lib/db";
// import Contract from "@/models/contract";

// export async function GET(_: any, { params }: any) {
//   await connectDB();
//   const contract = await Contract.findById(params.id);
//   return Response.json(contract);
// }

// export async function PATCH(req: { json: () => any }, { params }: any) {
//   await connectDB();
//   const data = await req.json();
//   const updatedContract = await Contract.findByIdAndUpdate(params.id, data, {
//     new: true,
//   });
//   return Response.json(updatedContract);
// }

// export async function DELETE(_: any, { params }: any) {
//   await connectDB();
//   await Contract.findByIdAndDelete(params.id);
//   return Response.json({ msg: "rest in peace contract " + params.id });
// }
