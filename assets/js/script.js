const sheetId = "1774H66Bt1Gl9MT_YLxuFpbDZtzcPe4XQgjB1p9Eiovo";
const apiKey = "AIzaSyD8XLZMEgRsPCeKzo5aZ0eSrN7XolPrJhQ";

const bus427GalwayTuamSchedule = '427 G->T!A1:A25';
const bus427GalwayTuamGalwayATU = '427 G->T!B1:B25';
const bus427GalwayTuamGalwayCity = '427 G->T!C1:C25';
const bus427GalwayTuamClaregalway = '427 G->T!D1:D25';

let schedule = bus427GalwayTuamSchedule;
let departure = bus427GalwayTuamGalwayCity;
let arrival = bus427GalwayTuamClaregalway;

const urlSchedule = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${schedule}?key=${apiKey}`;
const urlDeparture = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${departure}?key=${apiKey}`;
const urlArrival = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${arrival}?key=${apiKey}`;

fetch(urlSchedule)
    .then(response => response.json())
    .then(data => {
        const schedule = document.getElementById('schedule-days');
        data.values.forEach(row => {
          const rowElement = document.createElement('div');
          rowElement.textContent = row.join(', ');
          schedule.appendChild(rowElement);
        });
    })
    .catch(error => console.error('Error fetching data:', error));

    fetch(urlDeparture)
        .then(response => response.json())
        .then(data => {
            const departure = document.getElementById('departure');
            data.values.forEach(row => {
              const rowElement = document.createElement('div');
              rowElement.textContent = row.join(', ');
              departure.appendChild(rowElement);
            });
        })
        .catch(error => console.error('Error fetching data:', error));

fetch(urlArrival)
    .then(response => response.json())
    .then(data => {
        const arrival = document.getElementById('arrival');
        data.values.forEach(row => {
            const rowElement = document.createElement('div');
            rowElement.textContent = row.join(', ');
            arrival.appendChild(rowElement);
        });
    })
    .catch(error => console.error('Error fetching data:', error));
