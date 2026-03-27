export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/institutes`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("API failed");
    }

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error("API ERROR:", err);
    return Response.json({ error: "Failed to fetch" }, { status: 500 });
  }
}