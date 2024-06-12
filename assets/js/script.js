const sheetId = "1774H66Bt1Gl9MT_YLxuFpbDZtzcPe4XQgjB1p9Eiovo";
const apiKey = "AIzaSyD8XLZMEgRsPCeKzo5aZ0eSrN7XolPrJhQ";

function formUrl (sheetId, apiKey, range) {
    return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
}

// Function to populate the dropdown options based on the selected route
function populateOptions(routeValue) {
    const departureSelect = document.getElementById('departure-select');
    const arrivalSelect = document.getElementById('arrival-select');

    // Clear existing options
    departureSelect.innerHTML = '';
    arrivalSelect.innerHTML = '';

    // Enable the selects
    departureSelect.disabled = true;
    arrivalSelect.disabled = true;

    // Determine the range based on the selected route
    let departureRange, arrivalRange;
    if (routeValue === '427-Galway-Tuam') {
        departureRange = '427_G->T!B1:J1';
        arrivalRange = '427_G->T!B1:J1';
    } else if (routeValue === '427-Tuam-Galway') {
        departureRange = '427_T->G!B1:K1';
        arrivalRange = '427_T->G!B1:K';
    } else if (routeValue === '435') {
        console.log('No schedule for 435 yet');
    } else {
        console.log('Invalid route selected');
    }
    
    urlDeparture = null;
    if (departureRange) {
        urlDeparture = formUrl(sheetId, apiKey, departureRange);
    }
    urlArrival = null;
    if (arrivalRange) {
        urlArrival = formUrl(sheetId, apiKey, arrivalRange);
    }

    function showSchedule(url, elementId, selectedOption) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const element = document.getElementById(elementId);
                let i = 0;
                data.values[0].forEach(option => {
                    i++;
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    if (i === selectedOption) {
                        optionElement.selected = true;
                    }
                    element.appendChild(optionElement);
                });
            })
            .catch(error => console.error('Error fetching data: ', error));
    }
    
    if (urlDeparture && routeValue !== '435') {
        showSchedule(urlDeparture, 'departure-select', 2);
        departureSelect.disabled = false;
        }
    if (urlArrival && routeValue !== '435') {
        showSchedule(urlArrival, 'arrival-select', 8);
        arrivalSelect.disabled = false;
    }
}

// Event listener for route select change
document.getElementById('route-select').addEventListener('change', function() {
    const routeValue = this.value;
    populateOptions(routeValue);
});

// Event listener for form submit
document.getElementById('schedule-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(this);
    const selectedRoute = formData.get('route');
    const selectedDeparture = formData.get('departure');
    const selectedArrival = formData.get('arrival');
    console.log('Selected Route:', selectedRoute);
    console.log('Selected Departure:', selectedDeparture);
    console.log('Selected Arrival:', selectedArrival);
    // Call function to fetch combined schedule or perform other actions
});

// Initial population of options based on default route
const defaultRoute = document.getElementById('route-select').value;
populateOptions(defaultRoute);
