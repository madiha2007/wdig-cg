// app/api/careers/route.js
// O*NET Web Services API integration
// Sign up free at: https://services.onetcenter.org/
// Set ONET_USERNAME and ONET_PASSWORD in your .env.local

const ONET_BASE = "https://services.onetcenter.org/ws";
const auth = Buffer.from(
  `${process.env.ONET_USERNAME}:${process.env.ONET_PASSWORD}`
).toString("base64");

const headers = {
  Authorization: `Basic ${auth}`,
  Accept: "application/json",
};

// Domain keyword → O*NET keyword mapping
const DOMAIN_KEYWORDS = {
  Technology: "software",
  Medicine: "medical",
  Law: "legal",
  Finance: "finance",
  Engineering: "engineering",
  Arts: "design",
  Education: "teaching",
  Business: "management",
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain") || "Technology";
  const keyword = searchParams.get("keyword") || DOMAIN_KEYWORDS[domain] || domain;
  const start = parseInt(searchParams.get("start") || "1");
  const end = parseInt(searchParams.get("end") || "20");

  try {
    // 1. Search for occupations
    const searchRes = await fetch(
      `${ONET_BASE}/occupations?keyword=${encodeURIComponent(keyword)}&start=${start}&end=${end}`,
      { headers }
    );

    if (!searchRes.ok) throw new Error(`O*NET search failed: ${searchRes.status}`);
    const searchData = await searchRes.json();
    const occupations = searchData.occupation || [];

    // 2. Fetch details for each occupation in parallel
    const detailed = await Promise.all(
      occupations.slice(0, 12).map(async (occ) => {
        try {
          const [detailRes, wagesRes] = await Promise.all([
            fetch(`${ONET_BASE}/occupations/${occ.code}/summary`, { headers }),
            fetch(`${ONET_BASE}/occupations/${occ.code}/details/wages`, { headers }),
          ]);

          const detail = detailRes.ok ? await detailRes.json() : {};
          const wagesData = wagesRes.ok ? await wagesRes.json() : {};

          const nationalWage = wagesData.wages?.find((w) => w.scope === "National")
            || wagesData.wages?.[0];

          return {
            id: occ.code,
            title: occ.title,
            domain,
            description: detail.description || occ.title,
            bright_outlook: detail.bright_outlook || false,
            in_demand: detail.in_demand || false,
            education: detail.education?.level_required?.category?.[0]?.name || "Bachelor's Degree",
            skills: (detail.skills?.element || [])
              .slice(0, 5)
              .map((s) => s.name),
            salary: nationalWage
              ? {
                  median: nationalWage.annual_median,
                  low: nationalWage.annual_10th_percentile,
                  high: nationalWage.annual_90th_percentile,
                }
              : null,
            growth: detail.job_outlook?.outlook?.description || null,
            onet_link: `https://www.onetonline.org/link/summary/${occ.code}`,
          };
        } catch {
          return {
            id: occ.code,
            title: occ.title,
            domain,
            description: "",
            skills: [],
            salary: null,
            growth: null,
          };
        }
      })
    );

    return Response.json({ careers: detailed, total: searchData.total || detailed.length });
  } catch (err) {
    console.error("O*NET API error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

