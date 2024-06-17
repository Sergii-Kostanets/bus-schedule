const sheetId = "1774H66Bt1Gl9MT_YLxuFpbDZtzcPe4XQgjB1p9Eiovo";
const apiKey = "AIzaSyD8XLZMEgRsPCeKzo5aZ0eSrN7XolPrJhQ";

// Function to construct the URL for the Google Sheets API
function formUrl(sheetId, apiKey, range) {
    return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
}

// Function to get query parameters from the URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        route: params.get('route'),
        departure: params.get('departure'),
        arrival: params.get('arrival')
    };
}

route = getQueryParams().route;
// console.log('Route:     ', route)
departure = getQueryParams().departure;
// console.log('Departure: ', departure)
arrival = getQueryParams().arrival;
// console.log('Arrival:   ', arrival)

document.getElementById('departureHeader').textContent = departure;
document.getElementById('arrivalHeader').textContent = arrival;

// Update the fetchSchedule function to accept a custom range
function fetchSchedule(route, departure, arrival) {
    const range = `${route}!A1:Z100`; // Adjust the range according to your data
    const url = formUrl(sheetId, apiKey, range);

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            // Find the indexes for departure and arrival
            const headers = data.values[0];
            const departureIndex = headers.indexOf(departure);
            const arrivalIndex = headers.indexOf(arrival);

            if (departureIndex === -1 || arrivalIndex === -1) {
                throw new Error('Departure or Arrival location not found in the headers.');
            }

            // Extract relevant columns
            return data.values.slice(1)  // Skip the header row
                .map(row => ({
                    day: row[0],  // Assuming 'day' is at index 0
                    departureTime: row[departureIndex],
                    arrivalTime: row[arrivalIndex]
                }))
        })
        .catch(error => {console.error('Error fetching data: ', error);
            return [];}
    );
}
// fetchSchedule(route, departure, arrival).then(data => console.log('Filtered schedule: ', data));

// let fetchedSchedule = fetchSchedule(route, departure, arrival);
// console.log('fetchedSchedule: ', fetchedSchedule);

function filterSchedule(data, filter) {
    const today = new Date().toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
    // console.log('Today: ', today);

    return data.filter(row => {
        if (filter === 'TODAY') {
            if (today === 'SAT') return row.day.includes('Sa') || row.day.includes('M-Su');
            if (today === 'SUN') return row.day.includes('Su') || row.day.includes('Sun');
            if (today != 'SAT' && today != 'SUN') return row.day.includes('M');
        }
        if (filter === 'MO-FR') return row.day.includes('M');
        if (filter === 'SAT') return row.day.includes('Sa') || row.day.includes('M-Su');
        if (filter === 'SUN') return row.day.includes('Su') || row.day.includes('Sun');
        return true; // Default case, should not occur
    });
}

function displaySchedule(data) {
    const tableBody = document.getElementById('scheduleTable').querySelector('tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    data.forEach(row => {
        const tr = document.createElement('tr');
        // const dayTd = document.createElement('td');
        const departureTd = document.createElement('td');
        const arrivalTd = document.createElement('td');

        // dayTd.textContent = row.day;
        departureTd.textContent = row.departureTime;
        arrivalTd.textContent = row.arrivalTime;

        // tr.appendChild(dayTd);
        tr.appendChild(departureTd);
        tr.appendChild(arrivalTd);
        tableBody.appendChild(tr);
    });
}

function updateCheckedClass(selectedValue) {
    document.querySelectorAll('input[name="dayFilter"]').forEach(radio => {
        const label = radio.parentElement;
        if (radio.value === selectedValue) {
            label.classList.add('checked');
        } else {
            label.classList.remove('checked');
        }
    });
}

fetchSchedule(route, departure, arrival).then(data => {
    // Initial display of schedule
    const initialFilter = 'TODAY';
    const filteredData = filterSchedule(data, initialFilter);
    displaySchedule(filteredData);
    updateCheckedClass(initialFilter);

    // Add event listeners to radio buttons
    document.querySelectorAll('input[name="dayFilter"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            const filteredData = filterSchedule(data, event.target.value);
            displaySchedule(filteredData);
            updateCheckedClass(event.target.value);
        });
    });
});
