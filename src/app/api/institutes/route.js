export async function GET() {
  try {
    const res = await fetch("http://localhost:5000/institutes");
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch institutes" }), {
      status: 500,
    });
  }
}
