const sheetId = "1774H66Bt1Gl9MT_YLxuFpbDZtzcPe4XQgjB1p9Eiovo";
const apiKey = "AIzaSyD8XLZMEgRsPCeKzo5aZ0eSrN7XolPrJhQ";

const range = '427 G->T!D1:D25';
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

fetch(url)
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('schedule-container');
        data.values.forEach(row => {
          const rowElement = document.createElement('div');
          rowElement.textContent = row.join(', ');
          container.appendChild(rowElement);
        });
    })
    .catch(error => console.error('Error fetching data:', error));
