const sheetId = "1774H66Bt1Gl9MT_YLxuFpbDZtzcPe4XQgjB1p9Eiovo";
const apiKey = "AIzaSyD8XLZMEgRsPCeKzo5aZ0eSrN7XolPrJhQ";

const bus427GalwayTuamSchedule = '427 G->T!A1:A25';
const bus427GalwayTuamGalwayATU = '427 G->T!B1:B25';
const bus427GalwayTuamGalwayCity = '427 G->T!C1:C25';
const bus427GalwayTuamClaregalway = '427 G->T!D1:D25';
const bus427GalwayTuamLoughgeorge = '427 G->T!E1:E25';
const bus427GalwayTuamKnockdoe = '427 G->T!F1:F25';
const bus427GalwayTuamCorofinCross = '427 G->T!G1:G25';
const bus427GalwayTuamClaretuam = '427 G->T!H1:H25';
const bus427GalwayTuamTuam = '427 G->T!I1:I25';
const bus427GalwayTuamDunmore = '427 G->T!G1:G25';

let schedule = bus427GalwayTuamSchedule;
let departure = bus427GalwayTuamGalwayCity;
let arrival = bus427GalwayTuamClaregalway;

function formUrl (sheetId, apiKey, range) {
    return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
}

const urlSchedule = formUrl(sheetId, apiKey, schedule);
const urlDeparture = formUrl(sheetId, apiKey, departure);
const urlArrival = formUrl(sheetId, apiKey, arrival);

function fetchSchedule(url, range) {
    return fetch(url)
    // return fetch(`${url}&range=${range}`)
        .then(response => response.json())
        .then(data => data.values.map(row => row[0]))
        .catch(error => {console.error('Error fetching data: ', error);
            return [];}
    );
}

Promise.all([
    fetchSchedule(urlSchedule),
    fetchSchedule(urlDeparture),
    fetchSchedule(urlArrival)
]).then(([scheduleArray, departureArray, arrivalArray]) => {
    // Check if all arrays are defined and have the same length
    if (scheduleArray && departureArray && arrivalArray && 
        scheduleArray.length && departureArray.length && arrivalArray.length &&
        scheduleArray.length === departureArray.length && departureArray.length === arrivalArray.length) {

        const combinedArray = scheduleArray.map((schedule, index) => ({
            schedule: schedule,
            departure: departureArray[index],
            arrival: arrivalArray[index]
        }));

        console.log('Combined Array: ', combinedArray);

        // Display the combined data in HTML
        const container = document.getElementById('combined-schedule');
        combinedArray.forEach(item => {
            const itemElement = document.createElement('div');

            // Create separate divs for schedule, departure, and arrival
            const scheduleDiv = document.createElement('div');
            scheduleDiv.textContent = `${item.schedule}`;
            const departureDiv = document.createElement('div');
            departureDiv.textContent = `${item.departure}`;
            const arrivalDiv = document.createElement('div');
            arrivalDiv.textContent = `${item.arrival}`;
        
            // Append each div to the item element
            itemElement.appendChild(scheduleDiv);
            itemElement.appendChild(departureDiv);
            itemElement.appendChild(arrivalDiv);
        
            // Append the item element to the container
            container.appendChild(itemElement);
        });
        // Further processing of combinedArray if needed
    } else {
        console.error('Error: Arrays are not defined or lengths do not match.');
    }
}).catch(error => {
    console.error('Error in fetching data: ', error);
});
