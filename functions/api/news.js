export async function onRequestGet(context) {
  const token = context.env.COURTLISTENER_API_TOKEN;

  try {
    const url = "https://www.courtlistener.com/api/rest/v4/search/?type=o&order_by=dateFiled+desc&stat_Precedential=on&count=on";

    const res = await fetch(url, {
      headers: {
        "Authorization": `Token ${token}`,
        "User-Agent": "law4teen.org - legal education for teens",
      },
    });

    if (!res.ok) {
      console.error("CourtListener error:", res.status, await res.text());
      return new Response(JSON.stringify([]), { status: 500 });
    }

    const data = await res.json();

    const formatted = data.results.slice(0, 8).map((item) => ({
      title: item.caseName || item.caseNameFull || "Federal Court Opinion",
      summary: item.snippet
        ? item.snippet.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 240) + "..."
        : `A recent precedential opinion from ${item.court || "the federal courts"}.`,
      category: classifyCategory(item.caseName || ""),
      impact: classifyImpact(item.court || ""),
      pubDate: item.dateFiled,
      link: item.absolute_url
        ? `https://www.courtlistener.com${item.absolute_url}`
        : null,
      court: item.court,
      isLive: true,
    }));

    return new Response(JSON.stringify(formatted), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300", // cache 5 min
      },
    });
  } catch (err) {
    console.error("news.js error:", err);
    return new Response(JSON.stringify([]), { status: 500 });
  }
}

function classifyCategory(title) {
  const t = title.toLowerCase();
  if (t.includes("first amendment") || t.includes("free speech")) return "Constitutional Law";
  if (t.includes("patent") || t.includes("trademark")) return "Intellectual Property";
  if (t.includes("environment") || t.includes("epa")) return "Environmental Law";
  if (t.includes("tax") || t.includes("irs")) return "Tax Law";
  if (t.includes("immigration") || t.includes("asylum")) return "Immigration Law";
  if (t.includes("criminal") || t.includes("v. united states")) return "Criminal Law";
  return "Federal Law";
}

function classifyImpact(court) {
  if (court.toLowerCase().includes("supreme")) return "High";
  if (court.toLowerCase().includes("circuit")) return "Medium";
  return "Low";
}
