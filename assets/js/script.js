// GitHub
// const sheetId = sheetIdSecret();
// const apiKey = apiKeySecret();

// Netlify
const sheetId = '<%= process.env.SHEET_ID %>';
const apiKey = '<%= process.env.API_KEY %>';

const range = '427 G->T!D1:D25';
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => console.error('Error fetching data:', error));
