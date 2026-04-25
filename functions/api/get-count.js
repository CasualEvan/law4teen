export async function onRequest(context) {
  // 1. Get the KV binding from Cloudflare's environment
  // This 'STATS_DB' name must match the binding you make in the dashboard
  const { STATS_DB } = context.env;

  if (!STATS_DB) {
    return new Response(JSON.stringify({ error: "KV Binding missing" }), { status: 500 });
  }

  try {
    // 2. Retrieve the current count (or default to 0)
    const current = await STATS_DB.get("visitor_count") || "0";
    const newCount = parseInt(current) + 1;

    // 3. Save the incremented number
    await STATS_DB.put("visitor_count", newCount.toString());

    // 4. Return the new number to your React frontend
    return new Response(JSON.stringify({ count: newCount }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ count: 0, error: err.message }), { status: 500 });
  }
}
