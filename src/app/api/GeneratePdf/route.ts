// import { NextRequest, NextResponse } from "next/server";
// import puppeteer from "puppeteer";

// export async function POST(req: NextRequest) {
//   try {
//     const { html } = await req.json();

//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();

//     await page.setContent(html, {
//       waitUntil: "networkidle0",
//     });

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//     });

//     await browser.close();

//     return new NextResponse(pdfBuffer, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": "attachment; filename=report.pdf",
//       },
//     });
//   } catch (error) {
//     console.error("PDF generation error:", error);
//     return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
//   }
// }


// app/generate-pdf/route.ts (App Router)
import { NextRequest, NextResponse } from "next/server";
// import { generatePDFWithTailwind } from "@/lib/GeneratePdf";

export async function POST(req: NextRequest) {
  const { html } = await req.json();

  if (!html) {
    return NextResponse.json({ error: "Missing HTML content" }, { status: 400 });
  }

  // const pdfBuffer = await generatePDFWithTailwind(html);

  // return new NextResponse(pdfBuffer, {
  //   status: 200,
  //   headers: {
  //     "Content-Type": "application/pdf",
  //     "Content-Disposition": "attachment; filename=report.pdf",
  //   },
  // });
}

