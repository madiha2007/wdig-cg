// app/api/careers/route.js
// O*NET Web Services API v2.0
// Base URL: https://api-v2.onetcenter.org

const ONET_BASE = "https://api-v2.onetcenter.org";

function getHeaders() {
  return {
    "X-API-Key": process.env.ONET_API_KEY,
    Accept: "application/json",
  };
}

const DOMAIN_KEYWORDS = {
  Technology: "software developer",
  Medicine: "physician",
  Engineering: "mechanical engineer",
  Finance: "financial analyst",
  Law: "lawyer",
  Arts: "graphic designer",
  Education: "teacher",
  Business: "business manager",
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain") || "Technology";
  const keyword = searchParams.get("keyword") || DOMAIN_KEYWORDS[domain] || domain;

  try {
    const searchURL = `${ONET_BASE}/mnm/search?keyword=${encodeURIComponent(keyword)}&end=12`;
    console.log("Fetching:", searchURL);

    const searchRes = await fetch(searchURL, { headers: getHeaders() });

    if (!searchRes.ok) {
      const errText = await searchRes.text();
      console.error("O*NET search error:", searchRes.status, errText.slice(0, 200));
      throw new Error(`O*NET search failed: ${searchRes.status}`);
    }

    const searchData = await searchRes.json();
    const careers = searchData.career || [];

    if (careers.length === 0) {
      return Response.json({ careers: [], total: 0 });
    }

    const detailed = await Promise.all(
      careers.slice(0, 12).map(async (career) => {
        try {
          const code = career.code;
          const hdrs = getHeaders();

          const [overviewRes, outlookRes, skillsRes, educationRes] = await Promise.all([
            fetch(`${ONET_BASE}/mnm/careers/${code}/`, { headers: hdrs }),
            fetch(`${ONET_BASE}/mnm/careers/${code}/job_outlook`, { headers: hdrs }),
            fetch(`${ONET_BASE}/mnm/careers/${code}/skills`, { headers: hdrs }),
            fetch(`${ONET_BASE}/mnm/careers/${code}/education`, { headers: hdrs }),
          ]);

          const overview   = overviewRes.ok  ? await overviewRes.json() : {};
          const outlook    = outlookRes.ok   ? await outlookRes.json()  : {};
          const skillsData = skillsRes.ok    ? await skillsRes.json()   : {};
          const eduData    = educationRes.ok ? await educationRes.json(): {};

          const skills = (skillsData.element || []).slice(0, 5).map((s) => s.name);
          const education = eduData.education?.level_required?.category?.[0]?.name || "Bachelor's Degree";

          const wage = outlook.salary;
          const salary = wage ? {
            median: wage.annual_median_over || wage.annual_median,
            low: wage.annual_10th_percentile,
            high: wage.annual_90th_percentile,
            hourly_median: wage.hourly_median,
          } : null;

          return {
            id: code,
            title: career.title,
            domain,
            description: overview.what_they_do || "",
            bright_outlook: !!(overview.tags?.bright_outlook),
            in_demand: !!(overview.tags?.in_demand),
            education,
            skills,
            salary,
            growth: outlook.outlook?.description || null,
            onet_link: `https://www.onetonline.org/link/summary/${code}`,
          };
        } catch (err) {
          console.error(`Error for ${career.code}:`, err.message);
          return {
            id: career.code,
            title: career.title,
            domain,
            description: "",
            skills: [],
            salary: null,
            growth: null,
            bright_outlook: false,
            in_demand: false,
          };
        }
      })
    );

    return Response.json({ careers: detailed, total: searchData.total || detailed.length });
  } catch (err) {
    console.error("O*NET API error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}