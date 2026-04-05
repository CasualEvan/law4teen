export async function onRequestGet() {
  try {
    const url =
      "https://www.courtlistener.com/api/rest/v3/opinions/?format=json&order_by=-date_created&stat_Precedential=on";

    const res = await fetch(url, {
      headers: {
        "User-Agent": "law4teen",
      },
    });

    const data = await res.json();

    const formatted = data.results.slice(0, 8).map((item) => ({
      title: item.case_name || "Federal Court Opinion",
      summary: item.plain_text
        ? item.plain_text.replace(/\s+/g, " ").slice(0, 240) + "..."
        : "A recent precedential opinion from the federal courts.",
      category: classifyCategory(item.case_name || ""),
      impact: "Medium",
      pubDate: item.date_created,
      link: item.absolute_url
        ? `https://www.courtlistener.com${item.absolute_url}`
        : null,
      isLive: true,
    }));

    return new Response(JSON.stringify(formatted), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify([]), { status: 500 });
  }
}

function classifyCategory(title) {
  const t = title.toLowerCase();
  if (t.includes("v.") || t.includes("vs")) return "Criminal Law";
  if (t.includes("patent") || t.includes("trademark"))
    return "Intellectual Property";
  if (t.includes("environment")) return "Environmental Law";
  if (t.includes("tax")) return "Tax Law";
  return "General Law";
}