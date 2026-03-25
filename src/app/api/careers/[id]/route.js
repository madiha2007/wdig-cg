// app/api/careers/[id]/route.js
// Fetches full career detail for the modal — same data as app/careers/[id]/page.jsx

const ONET_BASE = "https://api-v2.onetcenter.org";

function getHeaders() {
  return { "X-API-Key": process.env.ONET_API_KEY, Accept: "application/json" };
}

function safeStr(val) {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") return val.name || val.title || val.statement || "";
  return String(val);
}

function inferDomain(title) {
  const t = (title || "").toLowerCase();
  if (/software|developer|programmer|cyber|network|cloud|devops|web |it |data scientist|machine learning/.test(t)) return "Technology";
  if (/physician|nurse|surgeon|medical|doctor|therapist|pharmacist|dentist|health|clinical/.test(t)) return "Medicine";
  if (/engineer|mechanical|electrical|civil|aerospace|chemical engineer|structural/.test(t)) return "Engineering";
  if (/financial|accountant|analyst|banker|economist|investment|actuari/.test(t)) return "Finance";
  if (/lawyer|attorney|legal|paralegal|judge|counsel/.test(t)) return "Law";
  if (/designer|artist|architect|animator|illustrator|creative/.test(t)) return "Arts";
  if (/teacher|professor|instructor|educator|tutor|principal/.test(t)) return "Education";
  if (/manager|executive|director|consultant|marketing|sales|human resource/.test(t)) return "Business";
  return "Technology";
}

export async function GET(request, { params }) {
  const { id } = await params;
  // id is the raw O*NET code, e.g. "15-1252.00"
  // (the explore page passes career.id which is the raw code from /api/careers list)
  const code = id;
  const headers = getHeaders();

  try {
    const [overviewRes, outlookRes, skillsRes, eduRes, knowledgeRes, tasksRes] = await Promise.all([
      fetch(`${ONET_BASE}/mnm/careers/${code}/`, { headers, next: { revalidate: 3600 } }),
      fetch(`${ONET_BASE}/mnm/careers/${code}/job_outlook`, { headers, next: { revalidate: 3600 } }),
      fetch(`${ONET_BASE}/mnm/careers/${code}/skills`, { headers, next: { revalidate: 3600 } }),
      fetch(`${ONET_BASE}/mnm/careers/${code}/education`, { headers, next: { revalidate: 3600 } }),
      fetch(`${ONET_BASE}/mnm/careers/${code}/knowledge`, { headers, next: { revalidate: 3600 } }),
      fetch(`${ONET_BASE}/online/occupations/${code}/summary/tasks`, { headers, next: { revalidate: 3600 } }),
    ]);

    const overview = overviewRes.ok ? await overviewRes.json() : {};
    const outlook = outlookRes.ok ? await outlookRes.json() : {};
    const skillsData = skillsRes.ok ? await skillsRes.json() : {};
    const eduData = eduRes.ok ? await eduRes.json() : {};
    const knowData = knowledgeRes.ok ? await knowledgeRes.json() : {};
    const tasksData = tasksRes.ok ? await tasksRes.json() : {};

    const wage = outlook.salary;
    const title = safeStr(overview.title) || code;
    const skills = (skillsData.element || []).slice(0, 10).map(safeStr).filter(Boolean);
    const knowledge = (knowData.element || []).slice(0, 6).map(safeStr).filter(Boolean);
    const tasks = (tasksData.task || []).slice(0, 8).map(safeStr).filter(Boolean);

    const rawAlso = overview.also_called?.title;
    const alsoCalled = Array.isArray(rawAlso)
      ? rawAlso.map(safeStr).filter(Boolean)
      : rawAlso ? [safeStr(rawAlso)] : [];

    const education = (eduData.education?.level_required?.category || [])
      .map(e => ({ name: safeStr(e), score: e?.score }))
      .filter(e => e.name);

    return Response.json({
      code,
      title,
      domain: inferDomain(title),
      description: safeStr(overview.what_they_do),
      also_called: alsoCalled,
      bright_outlook: !!(overview.tags?.bright_outlook),
      in_demand: !!(overview.tags?.in_demand),
      education,
      skills,
      knowledge,
      tasks,
      salary: wage ? {
        median: wage.annual_median_over || wage.annual_median,
        low: wage.annual_10th_percentile,
        high: wage.annual_90th_percentile,
        hourly_median: wage.hourly_median,
      } : null,
      growth: safeStr(outlook.outlook?.description),
      outlook_category: safeStr(outlook.outlook?.category),
      onet_link: `https://www.onetonline.org/link/summary/${code}`,
    });
  } catch (err) {
    console.error(`Career detail API error [${code}]:`, err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
