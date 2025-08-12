"use server";

export async function highlightKeyword(searchUrl: string) {
  try {
    // Extract keyword from the Google search URL
    const urlParams = new URLSearchParams(searchUrl.split("?")[1]);
    const keyword = urlParams.get("q");

    if (!keyword) throw new Error("No keyword found in the URL.");

    // Call SerpAPI using fetch
    const SERP_API_KEY = process.env.SERP_API_KEY;
    const serpApiUrl = `https://serpapi.com/search?q=${encodeURIComponent(
      keyword
    )}&hl=en&gl=us&num=100&api_key=${SERP_API_KEY}`;

    const res = await fetch(serpApiUrl);
    if (!res.ok) throw new Error(`SerpAPI request failed: ${res.statusText}`);

    const data = await res.json();
    const results = data.organic_results || [];

    // Build HTML and highlight the keyword
    const highlightedHtml = results
      .map((r: any) => {
        const title = r.title.replace(
          new RegExp(`(${keyword})`, "gi"),
          `<mark style="background:yellow;font-weight:bold;">$1</mark>`
        );
        return `<div style="margin-bottom:10px;">
                  <a href="${r.link}" target="_blank">${title}</a>
                </div>`;
      })
      .join("");

    return `
      <html>
        <body>
          <h1>Search results for "${keyword}"</h1>
          ${highlightedHtml}
        </body>
      </html>
    `;
  } catch (err: any) {
    console.error(err);
    throw new Error("Failed to fetch or highlight keyword");
  }
}
