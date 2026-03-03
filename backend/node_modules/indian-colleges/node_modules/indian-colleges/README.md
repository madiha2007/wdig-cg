
# Indian-Colleges
Indian-Colleges is an NPM package that provides a structured dataset of colleges in India, along with utility functions to filter colleges by state, district, or both. It works seamlessly in both backend (Node.js) and frontend (React or other frameworks) environments.

```
npm install indian-colleges
```

Usage
### CommonJS


```
const {
    getAllColleges,
    getCollegesByState,
    getCollegesByDistrict,
    getCollegesByStateAndDistrict
    getAllUniversities
} = require('indian-colleges');

console.log("All Colleges:", getAllColleges());
console.log("Colleges in Andhra Pradesh:", getCollegesByState('Andhra Pradesh'));
console.log("Colleges in Prakasam District:", getCollegesByDistrict('Prakasam'));
console.log("Colleges in Andhra Pradesh, Prakasam District:", getCollegesByStateAndDistrict('Andhra Pradesh', 'Prakasam'));
```


### Module

#### For ES Modules (default in modern front-end environments like React):

```
import {
    getAllColleges,
    getCollegesByState,
    getCollegesByDistrict,
    getCollegesByStateAndDistrict
    getAllUniversities
} from 'indian-colleges';

console.log("All Colleges:", getAllColleges());
console.log("Colleges in Andhra Pradesh:", getCollegesByState('Andhra Pradesh'));
console.log("Colleges in Prakasam District:", getCollegesByDistrict('Prakasam'));
console.log("Colleges in Andhra Pradesh, Prakasam District:", getCollegesByStateAndDistrict('Andhra Pradesh', 'Prakasam')

```
API Reference

###  Returns: Array - List of all colleges.
```
getAllColleges()
```


###  Returns: Array - List of all Universities.
```
getAllUniversities()
```


###  Returns: Array - List of all Universities and Colleges.
```
getAllCollegesAndUniversities()
```


### Returns: Array - List of colleges in the specified state.
```
getCollegesByState(state)
```
Filters colleges by a specific state.

Parameters:
state (String) - The name of the state.

### Returns: Array - List of colleges in the specified district.
```
getCollegesByDistrict(district)
```
Filters colleges by a specific district.

Parameters:
district (String) - The name of the district.
### Returns: Array - List of colleges in the specified state and district.
```
getCollegesByStateAndDistrict(state, district)
```
Filters colleges by both state and district.

Parameters:
state (String) - The name of the state.
district (String) - The name of the district.

### Sample JSON Array-
```
{
    university: 'Sampurnanand Sanskrit Vishwavidyalaya, Varanasi (Id: U-0537)',
    college: 'Shri Krushnabrahmacharyashram Sanskrit Mahavidyalaya, Hathras (Id: C-20588)',
    college_type: 'Affiliated College',
    state: 'Uttar Pradesh',
    district: 'Aligarh'
  },...
```



## Acknowledgements
-[Inspired by the need for a structured and easy-to-use dataset of Indian colleges.](),

-[Maintained by the open-source community.]()

-[Feel free to use and adapt this README file for your library!]()