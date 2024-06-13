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

console.log('Route: ', getQueryParams()['route']); // DEBUG
console.log('Depature: ', getQueryParams()['departure']); // DEBUG
console.log('Arrival: ', getQueryParams()['arrival']); // DEBUG

// Function to display the schedule
function displaySchedule(route, departure, arrival) {
    const range = `${route}!A1:Z100`; // Adjust the range according to your data
    const url = formUrl(sheetId, apiKey, range);

    return fetch(url)
        .then(response => response.json())
        .then(data => data.values.map(row => row))
        .catch(error => {console.error('Error fetching data: ', error);
            return [];}
    );
}

// Get the query parameters from the URL
const params = getQueryParams();
if (params.route && params.departure && params.arrival) {
    let test = displaySchedule(params.route, params.departure, params.arrival);
    console.log(test)
} else {
    console.error('Departure or arrival parameter is missing in the URL.');
}
