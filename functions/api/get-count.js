// functions/get-count.js
export async function onRequest(context) {
  const API_KEY = "GX8xdjbZ0VbqjUBNFU2t5d3yHN3w6aHZApLX5apI"; 
  const ID = "l4t_global";

  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/counter?id=${ID}&hit=true`, {
      headers: { "X-Api-Key": API_KEY }
    });
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    // If the API fails, return a safe "0" so the site doesn't crash
    return new Response(JSON.stringify({ count: 0 }), { status: 500 });
  }
}
