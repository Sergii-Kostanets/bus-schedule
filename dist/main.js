fetch("https://sheets.googleapis.com/v4/spreadsheets/1774H66Bt1Gl9MT_YLxuFpbDZtzcPe4XQgjB1p9Eiovo/values/427 G->T!D1:D25?key=AIzaSyD8XLZMEgRsPCeKzo5aZ0eSrN7XolPrJhQ").then((e=>e.json())).then((e=>{console.log(e)})).catch((e=>console.error("Error fetching data:",e)));