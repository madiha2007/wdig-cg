const colleges = require('./colleges.json');

function getAllColleges() {
    return colleges.map(college => college.college);
}

function getCollegesByState(state) {
    return colleges.filter(college => college.state === state);
}

function getCollegesByDistrict(district) {
    return colleges.filter(college => college.district === district);
}

function getCollegesByStateAndDistrict(state, district) {
    return colleges.filter(
        college => college.state === state && college.district === district
    );
}
function getAllUniversities() {
    return [...new Set(colleges.map(college => college.university))];
  }


  function getAllCollegesAndUniversities() {
    return [...new Set([
      ...colleges.map(college => college.university),

      ...colleges.map(college => college.college)
    ])];
  }
  
  

module.exports = {
    getAllColleges,
    getCollegesByState,
    getCollegesByDistrict,
    getCollegesByStateAndDistrict,
    getAllUniversities,
    getAllCollegesAndUniversities
};
