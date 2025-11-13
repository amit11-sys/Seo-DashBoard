// import { NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";

// export async function POST(req: Request) {
//   try {
//     const { filename } = await req.json();

//     if (!filename) {
//       return NextResponse.json(
//         { success: false, error: "Filename is required" },
//         { status: 400 }
//       );
//     }

//     // 🧭 resolve the full path (safe)
//     const filePath = path.join(process.cwd(), "public", "uploads", path.basename(filename));

//     // 🧹 delete file if exists
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//       return NextResponse.json({ success: true, message: "File deleted successfully" });
//     } else {
//       return NextResponse.json(
//         { success: false, error: "File not found" },
//         { status: 404 }
//       );
//     }
//   } catch (err: any) {
//     console.error("Delete error:", err);
//     return NextResponse.json(
//       { success: false, error: err.message || "Delete failed" },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const filenames = Array.isArray(body.filename)
      ? body.filename
      : [body.filename];

    if (!filenames || filenames.length === 0) {
      return NextResponse.json(
        { success: false, error: "No filenames provided" },
        { status: 400 }
      );
    }

    const deleted: string[] = [];
    const notFound: string[] = [];
    const errors: { name: string; error: string }[] = [];

    for (const name of filenames) {
      if (!name) continue;

      const safeName = path.basename(name); // 🧩 sanitize name
      const filePath = path.join(process.cwd(), "public", "uploads", safeName);

      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          deleted.push(safeName);
        } else {
          notFound.push(safeName);
        }
      } catch (err: any) {
        errors.push({ name: safeName, error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      deleted,
      notFound,
      errors,
      message: `Deleted ${deleted.length}, not found ${notFound.length}`,
    });
  } catch (err: any) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Delete failed" },
      { status: 500 }
    );
  }
}
