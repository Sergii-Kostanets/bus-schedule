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
console.log('Route:     ', route)
departure = getQueryParams().departure;
console.log('Departure: ', departure)
arrival = getQueryParams().arrival;
console.log('Arrival:   ', arrival)





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
fetchSchedule(route, departure, arrival).then(data => console.log(data));

let fetchedSchedule = fetchSchedule(route, departure, arrival);
console.log('fetchedSchedule: ', fetchedSchedule);
