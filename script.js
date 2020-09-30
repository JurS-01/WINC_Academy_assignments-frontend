import { randomPersonData } from './randomPersonData.js'

const listInDOM = document.getElementById('list-ul');
const clearList = () => listInDOM.innerHTML = "";

const listMatches = document.getElementById('matches-ul');
const clearMatches = () => listMatches.innerHTML = "";

const countrySelectorContainer = document.getElementById('country-selector-btns');
const clearCountrySelectors = () => countrySelectorContainer.innerHTML = "";

const filterDescripton = document.getElementById('filter-description');
const addDescription = description => filterDescripton.innerHTML = description;

const sortByRegion = (list) => list.sort((a, b) => a.region.localeCompare(b.region));
const sortByName = (list) => list.sort((a, b) => a.name.localeCompare(b.name));

const removeDuplicates = (data, key) => {
    return [...new Map(data.map(person => [key(person), person])).values()]
}


// 1. LANDENLIJST

const addCountryList = (list) => {
    clearList(), clearCountrySelectors(), clearMatches()
    list.forEach((person) => {
        const personToAdd = document.createElement('li');
        personToAdd.innerHTML = `${person.region}`
        listInDOM.appendChild(personToAdd);
    })
}

const listUniqueCountries = () => {
    sortByRegion(randomPersonData)
    const uniqueRegions = removeDuplicates(randomPersonData, person => person.region);
    addCountryList(uniqueRegions);
    addDescription('All Countries')
}
document.getElementsByClassName('country-btn')[0].addEventListener('click', listUniqueCountries)



// 2. STEENBOKVROUWEN

const listFemaleCapricorns = () => {
    clearList(), clearCountrySelectors(), clearMatches();
    addDescription('Female Capricorns 30+'), sortByName(randomPersonData)
    randomPersonData.forEach((person) => {
        if (person.gender === "female" && person.age > 30 && getZodiacSign(person.birthday.dmy) == 'Capricorn') {
            const personToAdd = document.createElement('li');
            personToAdd.innerHTML = `${person.name} ${person.surname} <br><img src=\"${person.photo}">`;
            listInDOM.appendChild(personToAdd);
        }
    })
}
document.getElementsByClassName('capricorn-btn')[0].addEventListener('click', listFemaleCapricorns)


const getZodiacSign = (birthday) => {
    const parts = birthday.split('/');
    const myDate = new Date(parts[2], parts[1] - 1, parts[0]);
    let month = myDate.getMonth()
    month = month + 1;
    const day = myDate.getDate()
    if ((month == 1 && day <= 20) || (month == 12 && day >= 22)) {
        return 'Capricorn';
    } else if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) {
        return 'Aquarius';
    } else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) {
        return 'Pisces';
    } else if ((month == 3 && day >= 21) || (month == 4 && day <= 20)) {
        return 'Aries';
    } else if ((month == 4 && day >= 21) || (month == 5 && day <= 20)) {
        return 'Taurus';
    } else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
        return 'Gemini';
    } else if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) {
        return 'Cancer';
    } else if ((month == 7 && day >= 23) || (month == 8 && day <= 23)) {
        return 'Leo';
    } else if ((month == 8 && day >= 24) || (month == 9 && day <= 23)) {
        return 'Virgo';
    } else if ((month == 9 && day >= 24) || (month == 10 && day <= 23)) {
        return 'Libra';
    } else if ((month == 10 && day >= 24) || (month == 11 && day <= 22)) {
        return 'Scorpio';
    } else if ((month == 11 && day >= 23) || (month == 12 && day <= 21)) {
        return 'Sagittarius';
    }
}


// 3. OUDE CREDITCARDS

const today = new Date();
const nextYear = new Date();
const getYear = today.getFullYear() + 1;
nextYear.setFullYear(getYear);

const listOldCards = () => {
    clearList(), clearCountrySelectors(), clearMatches(), addDescription('Soon to expire creditcards (adults)')
    randomPersonData.forEach((person) => {
        const expirationWithDay = `1 / ${person.credit_card.expiration} `;
        const parts = expirationWithDay.split('/');
        const fullYear = `20${parts[2]}`
        const fullDate = new Date(fullYear, parts[1] - 1, parts[0]);
        if (person.age > 17 && fullDate > today && fullDate < nextYear) {
            const personToAdd = document.createElement('li');
            personToAdd.innerHTML = `${person.name} ${person.surname}<br>${person.phone}<br>${person.credit_card.expiration}`;
            listInDOM.appendChild(personToAdd);
        }
    })
}
document.getElementsByClassName('old-cards-btn')[0].addEventListener('click', listOldCards)



// 4. MEESTE MENSEN

const addPopCountriesToDom = (a, b) => {
    addDescription('Number of clients per country')
    const personToAdd = document.createElement('li');
    personToAdd.innerHTML = `${a} (${b})<br>`;
    listInDOM.appendChild(personToAdd);
}

const getPopulationCountries = () => {
    clearList(), clearCountrySelectors(), clearMatches()
    sortByRegion(randomPersonData)
    let current = null;
    let cnt = 0;
    randomPersonData.forEach((person) => {
        if (person.region != current) {
            if (cnt > 0) {
                // console.log(typeof cnt);
                // cnt.sort((a, b) => b - a)
                addPopCountriesToDom(current, cnt)
            }
            current = person.region;
            cnt = 1;
        } else {
            cnt++;
        }
    })
    if (cnt > 0) {
        addPopCountriesToDom(current, cnt)
    }
}
document.getElementsByClassName('country#-btn')[0].addEventListener('click', getPopulationCountries)



//  5. GEMIDDELDE LEEFTIJD

const addCountryButtons = () => {
    clearList(), clearMatches(), addDescription('Average age per country'), sortByRegion(randomPersonData);
    const uniqueRegions = removeDuplicates(randomPersonData, person => person.region);
    uniqueRegions.forEach((person) => {
        const buttonToAdd = document.createElement('li')
        buttonToAdd.innerHTML = `<button class="age-country-btn">${person.region}</button>`
        countrySelectorContainer.appendChild(buttonToAdd)
    })
    const countryButtons = document.querySelectorAll('.age-country-btn')
    countryButtons.forEach((button) => button.addEventListener('click', getAverageAge))
}
document.getElementsByClassName('average-age-btn')[0].addEventListener('click', addCountryButtons)



const getAverageAge = () => {
    clearList()
    const country = event.target
    const locals = randomPersonData.filter((person) => person.region === country.innerHTML)
    const allAgesInCountry = locals.map((person) => Number(person.age))
    const averageAge = Math.round(allAgesInCountry.reduce((a, b) => a + b) / allAgesInCountry.length);
    printCountryAge(country.innerHTML, averageAge)
}


const printCountryAge = (location, age) => {
    const personToAdd = document.createElement('li');
    personToAdd.innerHTML = `The average age in ${location} is ${age}`;
    listInDOM.appendChild(personToAdd);
}



/// 6. Matchmaking

const listAllUsers = () => {
    clearList(), clearCountrySelectors(), clearMatches();
    sortByName(randomPersonData), addDescription(`Select person to find matches`);
    randomPersonData.forEach((person) => {
        let zodiacSign = getZodiacSign(person.birthday.dmy);
        const personToAdd = document.createElement('li');
        personToAdd.innerHTML = `${person.name} ${person.surname}<br>${person.region}<br>
        ${person.gender}<br>${person.age}<br>${zodiacSign}<br>
        <img src=\"${person.photo}"><br><button class="find-match-btn" value="${zodiacSign}/${person.gender}">find match</button>`;
        listInDOM.appendChild(personToAdd);
    })
    const findMatchButtons = document.querySelectorAll('.find-match-btn')
    findMatchButtons.forEach((button) => button.addEventListener('click', findMatch))
}
document.getElementsByClassName('matchmaking-btn')[0].addEventListener('click', listAllUsers)


const findMatch = () => {
    clearList(), addDescription('Selected person:')
    const selectedBtn = event.target
    const selectedPerson = selectedBtn.parentElement
    const selectedValues = event.target.value
    const valueParts = selectedValues.split('/');
    const personToAdd = document.createElement('li');
    personToAdd.innerHTML = `${selectedPerson.innerHTML}<br><br><br><h3>Matches found:</h3>`
    listInDOM.appendChild(personToAdd);
    randomPersonData.forEach((person) => {
        if (getZodiacSign(person.birthday.dmy) === valueParts[0] && person.gender != valueParts[1]) {
            const matchToAdd = document.createElement('li');
            matchToAdd.innerHTML = `${person.name} ${person.surname}<br>${person.region}<br>${person.gender}<br>
        ${person.age}<br>${getZodiacSign(person.birthday.dmy)}<br><img src=\"${person.photo}">`;
            listMatches.appendChild(matchToAdd);
        }
    })
}
