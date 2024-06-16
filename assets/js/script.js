const sheetId = "1774H66Bt1Gl9MT_YLxuFpbDZtzcPe4XQgjB1p9Eiovo";
const apiKey = "AIzaSyD8XLZMEgRsPCeKzo5aZ0eSrN7XolPrJhQ";

// Function to construct the URL for the Google Sheets API
function formUrl(sheetId, apiKey, range) {
    return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
}

// Function to populate the dropdown options based on the selected route
function populateOptions(routeValue) {
    const departureSelect = document.getElementById('departure-select');
    const arrivalSelect = document.getElementById('arrival-select');

    // Clear existing options
    departureSelect.innerHTML = '';
    arrivalSelect.innerHTML = '';

    // Disable the selects initially
    departureSelect.disabled = true;
    arrivalSelect.disabled = true;

    // Determine the range based on the selected route
    let range, defaultDeparture;
    if (routeValue === '427-Galway->Tuam') {
        range = '427-Galway->Tuam!B1:J1';
        defaultDeparture = 'Galway City';
    } else if (routeValue === '427-Tuam->Galway') {
        range = '427-Tuam->Galway!B1:K1';
        defaultDeparture = 'Tuam';
    } else if (routeValue === '435') {
        console.log('No schedule for 435 yet');
    } else {
        console.log('Invalid route selected');
    }

    // Form the URL for fetching data
    let url = null;
    if (range) {
        url = formUrl(sheetId, apiKey, range);
    }

    // Function to fetch and display schedule options
    function showSchedule(url, departureSelect, arrivalSelect, defaultDeparture) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let stops = data.values[0];

                // Populate the departure dropdown
                stops.forEach(stop => {
                    const optionElement = document.createElement('option');
                    optionElement.value = stop;
                    optionElement.textContent = stop;
                    if (stop === defaultDeparture) {
                        optionElement.selected = true;
                    }
                    departureSelect.appendChild(optionElement);
                });

                // Add event listener to departure dropdown
                departureSelect.addEventListener('change', function() {
                    // Clear existing options in arrival dropdown
                    arrivalSelect.innerHTML = '';

                    // Get the selected departure stop
                    const selectedDeparture = departureSelect.value;
                    const selectedDepartureIndex = stops.indexOf(selectedDeparture);

                    // Populate the arrival dropdown with stops after the selected departure
                    for (let i = selectedDepartureIndex + 1; i < stops.length; i++) {
                        const optionElement = document.createElement('option');
                        optionElement.value = stops[i];
                        optionElement.textContent = stops[i];
                        arrivalSelect.appendChild(optionElement);
                    }

                    // Enable the arrival select
                    arrivalSelect.disabled = false;
                });

                // Enable the departure select
                departureSelect.disabled = false;

                // Trigger the change event for the departure select to populate the arrival select
                departureSelect.dispatchEvent(new Event('change'));
            })
            .catch(error => console.error('Error fetching data: ', error));
    }

    // Populate the dropdowns with the fetched data
    if (url && routeValue !== '435') {
        showSchedule(url, departureSelect, arrivalSelect, defaultDeparture);
    }
}

// Event listener for route radio buttons change
document.querySelectorAll('input[name="route"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const routeValue = this.value;
        populateOptions(routeValue);
    });
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

    // Construct the new URL with query parameters
    const newUrl = `/route.html?route=${encodeURIComponent(selectedRoute)}&departure=${encodeURIComponent(selectedDeparture)}&arrival=${encodeURIComponent(selectedArrival)}`;
    
    // Redirect to the new URL
    window.location.href = newUrl;
});

// Initial population of options based on the default route
const defaultRoute = document.querySelector('input[name="route"]:checked').value;
populateOptions(defaultRoute);
