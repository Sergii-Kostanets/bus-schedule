const sheetId = "1774H66Bt1Gl9MT_YLxuFpbDZtzcPe4XQgjB1p9Eiovo";
const apiKey = "AIzaSyD8XLZMEgRsPCeKzo5aZ0eSrN7XolPrJhQ";

// Function to construct the URL for the Google Sheets API
function formUrl(sheetId, apiKey, range) {
    return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
}

// Function to show the loading overlay
function showLoadingOverlay() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

// Function to hide the loading overlay
function hideLoadingOverlay() {
    document.getElementById('loading-overlay').style.display = 'none';
}

// Function to populate the radio buttons based on the selected route
function populateOptions(routeValue) {
    const departureFieldset = document.getElementById('departure-fieldset');
    const arrivalFieldset = document.getElementById('arrival-fieldset');

    // Clear existing radio buttons
    departureFieldset.innerHTML = '<legend>Departure:</legend>';
    arrivalFieldset.innerHTML = '<legend>Arrival:</legend>';

    // Show the loading overlay
    showLoadingOverlay();
    
    // Disable the fieldsets initially
    departureFieldset.disabled = true;
    arrivalFieldset.disabled = true;

    // Determine the range based on the selected route
    let range, defaultDeparture;
    if (routeValue === '427-Galway->Tuam') {
        range = '427-Galway->Tuam!B1:J1';
        defaultDeparture = 'Galway City';
        defaultArrival = 'Tuam';
    } else if (routeValue === '427-Tuam->Galway') {
        range = '427-Tuam->Galway!B1:K1';
        defaultDeparture = 'Tuam';
        defaultArrival = 'Galway City';
    } else if (routeValue === '435-Galway->Headford') {
        range = '435-Galway->Headford!B1:I1';
        defaultDeparture = 'Galway City';
        defaultArrival = 'Headford';
    } else if (routeValue === '435-Headford->Galway') {
        range = '435-Headford->Galway!B1:J1';
        defaultDeparture = 'Headford';
        defaultArrival = 'Galway City';
    } else {
        console.log('Invalid route selected');
    }

    // Form the URL for fetching data
    let url = null;
    if (range) {
        url = formUrl(sheetId, apiKey, range);
    }

    // Function to fetch and display schedule options
    function showSchedule(url, departureFieldset, arrivalFieldset, defaultDeparture, defaultArrival) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let stops = data.values[0];

                // Populate the departure fieldset
                stops.forEach(stop => {
                    const labelElement = document.createElement('label');
                    if (stop === defaultDeparture) {
                        labelElement.classList.add('checked');
                    }
                    labelElement.innerHTML = `
                        <input type="radio" name="departure" value="${stop}" ${stop === defaultDeparture ? 'checked' : ''}>
                        ${stop}
                    `;
                    departureFieldset.appendChild(labelElement);
                    departureFieldset.appendChild(document.createElement('br'));
                });

                // Add event listener to departure radio buttons
                departureFieldset.addEventListener('change', function() {
                    // Clear existing radio buttons in arrival fieldset
                    arrivalFieldset.innerHTML = '<legend>Arrival:</legend>';

                    // Get the selected departure stop
                    const selectedDeparture = document.querySelector('input[name="departure"]:checked').value;
                    const selectedDepartureIndex = stops.indexOf(selectedDeparture);

                    // Populate the arrival fieldset with stops after the selected departure
                    for (let i = selectedDepartureIndex + 1; i < stops.length; i++) {
                        const labelElement = document.createElement('label');
                        if (stops[i] === defaultArrival) {
                            labelElement.classList.add('checked');
                        }
                        labelElement.innerHTML = `
                            <input type="radio" name="arrival" value="${stops[i]}" ${stops[i] === defaultArrival ? 'checked' : ''}>
                            ${stops[i]}
                        `;
                        arrivalFieldset.appendChild(labelElement);
                        arrivalFieldset.appendChild(document.createElement('br'));
                    }

                    // Enable the arrival fieldset
                    arrivalFieldset.disabled = false;

                    // Add checked class to departure radio buttons
                    document.querySelectorAll('input[name="departure"]').forEach(radio => {
                        radio.addEventListener('change', function() {
                            document.querySelectorAll('input[name="departure"]').forEach(radio => {
                                const label = radio.parentNode;
                                if (radio.checked) {
                                    label.classList.add('checked');
                                } else {
                                    label.classList.remove('checked');
                                }
                            });
                        });
                        // Add checked class to arrival radio buttons
                        document.querySelectorAll('input[name="arrival"]').forEach(radio => {
                            radio.addEventListener('change', function() {
                                document.querySelectorAll('input[name="arrival"]').forEach(radio => {
                                    const label = radio.parentNode;
                                    if (radio.checked) {
                                        label.classList.add('checked');
                                    } else {
                                        label.classList.remove('checked');
                                    }
                                });
                            });
                        });
                    });
                });

                // Enable the departure fieldset
                departureFieldset.disabled = false;

                // Trigger the change event for the departure fieldset to populate the arrival fieldset
                const event = new Event('change');
                departureFieldset.dispatchEvent(event);
            })
            .catch(error => console.error('Error fetching data: ', error))
            .finally(() => {
                // Hide the loading overlay
                hideLoadingOverlay();
            });
    }

    // Populate the radio buttons with the fetched data
    if (url && routeValue !== '435') {
        showSchedule(url, departureFieldset, arrivalFieldset, defaultDeparture, defaultArrival);
    }
}

// Function to apply the checked class to the selected label
function applyCheckedClass() {
    const routeRadios = document.querySelectorAll('input[name="route"]');
    routeRadios.forEach(radio => {
        const label = radio.parentNode;
        if (radio.checked) {
            label.classList.add('checked');
        } else {
            label.classList.remove('checked');
        }
    });
}

// Event listener for route radio buttons change
document.querySelectorAll('input[name="route"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const routeValue = this.value;
        populateOptions(routeValue);
        applyCheckedClass();
    });
});

// Event listener for form submit
document.getElementById('schedule-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(this);
    const selectedRoute = formData.get('route');
    const selectedDeparture = formData.get('departure');
    const selectedArrival = formData.get('arrival');

    // Construct the new URL with query parameters
    const newUrl = `/route.html?route=${encodeURIComponent(selectedRoute)}&departure=${encodeURIComponent(selectedDeparture)}&arrival=${encodeURIComponent(selectedArrival)}`;
    
    // Redirect to the new URL
    window.location.href = newUrl;
});

// Initial population of options based on the default route
const defaultRoute = document.querySelector('input[name="route"]:checked').value;
populateOptions(defaultRoute);
applyCheckedClass();
