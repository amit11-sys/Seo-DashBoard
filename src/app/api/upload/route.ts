import { NextResponse } from "next/server";
import formidable, { Fields, Files } from "formidable";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { IncomingMessage } from "http";

// export const config = {
//   api: {
//     bodyParser: false, // ❌ disable default parser for file upload
//   },
// };

// ensure upload dir exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🧩 helper: convert web ReadableStream → Node Readable
async function webStreamToNodeStream(stream: ReadableStream) {
  const reader = stream.getReader();
  const nodeStream = new Readable({
    read() {},
  });

  async function pump() {
    const { done, value } = await reader.read();
    if (done) {
      nodeStream.push(null);
      return;
    }
    nodeStream.push(Buffer.from(value));
    pump();
  }

  pump();
  return nodeStream;
}

export async function POST(req: Request) {
  try {
    const form = formidable({
      multiples: true,
      uploadDir,
      keepExtensions: true,
      filename: (name, ext, part) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        return `${unique}-${part.originalFilename}`;
      },
    });

    // convert req.body (WebStream) → mock IncomingMessage
    const nodeStream = await webStreamToNodeStream(req.body!);
    const mockReq = Object.assign(nodeStream, {
      headers: Object.fromEntries(req.headers.entries()),
      method: req.method,
      url: req.url,
    }) as unknown as IncomingMessage;

    // 🧠 parse using formidable
    const { fields, files }: { fields: Fields; files: Files } = await new Promise((resolve, reject) => {
      form.parse(mockReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // 🗂️ collect file URLs
    const uploadedFiles: string[] = [];
    const fileArray = Array.isArray(files.file)
      ? files.file
      : [files.file].filter(Boolean);

    for (const file of fileArray) {
      uploadedFiles.push(`/uploads/${path.basename(file?.filepath || "")}`);
    }

    return NextResponse.json({ success: true, files: uploadedFiles });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
