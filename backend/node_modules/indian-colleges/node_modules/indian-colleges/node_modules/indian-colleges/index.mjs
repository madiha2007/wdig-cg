let colleges;

async function loadColleges() {
    if (!colleges) {
        colleges = await import('./colleges.json').then(module => module.default);
    }
    return colleges;
}

export async function getAllColleges() {
    const colleges = await loadColleges();
    return colleges.map(college => college.college);
}

export async function getCollegesByState(state) {
    const colleges = await loadColleges();
    return colleges.filter(college => college.state === state);
}

export async function getCollegesByDistrict(district) {
    const colleges = await loadColleges();
    return colleges.filter(college => college.district === district);
}

export async function getCollegesByStateAndDistrict(state, district) {
    const colleges = await loadColleges();
    return colleges.filter(
        college => college.state === state && college.district === district
    );
}



export async function getAllUniversities() {
    const colleges = await loadColleges();
    return [...new Set(colleges.map(college => college.university))];
}
export async function getAllCollegesAndUniversities() {
    const colleges = await loadColleges();
    return [...new Set([
        ...colleges.map(college => college.university),

        ...colleges.map(college => college.college)
    ])];
}
