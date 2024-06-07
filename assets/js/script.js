const ClaregalwayGalway = [
  { day: 'M-F', time: '07:00' },
  { day: 'M-F', time: '07:25' },
  { day: 'M-F', time: '07:45' },
  { day: 'M-F', time: '07:55' },
  { day: 'M-F', time: '08:01' },
  { day: 'M-F', time: '08:15' },
  { day: 'Sa', time: '08:15' },
  { day: 'M-F*', time: '08:20' },
  { day: 'M-F', time: '08:55' },
  { day: 'Sa', time: '08:55' },
  { day: 'M-F', time: '09:30' },
  { day: 'Sa', time: '09:30' },
  { day: 'M-Sa', time: '10:25' },
  { day: 'M-Su', time: '11:15' },
  { day: 'M-F', time: '11:55' },
  { day: 'M-Su', time: '12:25' },
  { day: 'M-F', time: '13:35' },
  { day: 'M-Su', time: '14:35' },
  { day: 'M-Sa', time: '15:35' },
  { day: 'M-Su', time: '16:35' },
  { day: 'M-Su', time: '17:35' },
  { day: 'M-F', time: '18:35' },
  { day: 'M-Su', time: '19:35' },
  { day: 'M-Sa', time: '20:35' }
];

const GalwayClaregalway = [
  { day: 'M-F', time: '08:00' },
  { day: 'M-Sa', time: '09:05' },
  { day: 'M-Sa', time: '09:35' },
  { day: 'M-F', time: '10:05' },
  { day: 'M-Sa', time: '10:50' },
  { day: 'M-F', time: '12:10' },
  { day: 'M-Su', time: '13:10' },
  { day: 'M-F', time: '13:40' },
  { day: 'M-Su', time: '14:10' },
  { day: 'M-F', time: '15:00' },
  { day: 'M-F', time: '15:30' },
  { day: 'M-Su', time: '16:10' },
  { day: 'M-F', time: '16:20' },
  { day: 'M-F', time: '16:40' },
  { day: 'M-Sa', time: '17:10' },
  { day: 'M-F', time: '17:20' },
  { day: 'M-Sa', time: '17:40' },
  { day: 'Sun', time: '17:40' },
  { day: 'M-F', time: '18:05' },
  { day: 'M-Su', time: '18:20' },
  { day: 'M-Sa', time: '19:10' },
  { day: 'M-Sa', time: '20:10' },
  { day: 'M-Su', time: '21:10' }
];

function ClaregalwayGalwaySchedule(day) {
  let schedule = [];
  if (day === 'Saturday') {
    schedule = ClaregalwayGalway.filter(entry => entry.day === 'M-Sa' || entry.day === 'Sa' || entry.day === 'M-Su');
  } else if (day === 'Sunday') {
    schedule = ClaregalwayGalway.filter(entry => entry.day === 'M-Su' || entry.day === 'Sun');
  } else {
    schedule = ClaregalwayGalway.filter(entry => entry.day.includes('M-F') || entry.day === 'M-Sa' || entry.day === 'M-Su');
  }
  return schedule;
}

function GalwayClaregalwaySchedule(day) {
  let schedule = [];
  if (day === 'Saturday') {
    schedule = GalwayClaregalway.filter(entry => entry.day === 'M-Sa' || entry.day === 'Sa' || entry.day === 'M-Su');
  } else if (day === 'Sunday') {
    schedule = GalwayClaregalway.filter(entry => entry.day === 'M-Su' || entry.day === 'Sun');
  } else {
    schedule = GalwayClaregalway.filter(entry => entry.day.includes('M-F') || entry.day === 'M-Sa' || entry.day === 'M-Su');
  }
  return schedule;
}

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function filterSchedule(schedule) {
  const currentTime = getCurrentTime();
  const filteredSchedule = schedule.filter(entry => {
    const entryTime = entry.time.split(':');
    const entryHours = parseInt(entryTime[0]);
    const entryMinutes = parseInt(entryTime[1]);
    const currentHours = parseInt(currentTime.split(':')[0]);
    const currentMinutes = parseInt(currentTime.split(':')[1]);

    if (entryHours < currentHours || (entryHours === currentHours && entryMinutes < currentMinutes)) {
      return false;
    }
    return true;
  });
  return filteredSchedule;
}

function updateSchedule() {
    const selectedRadioButton = document.querySelector('input[name="dayOfTheWeek"]:checked');

    // Remove the "checked" class from all radio button labels
    document.querySelectorAll('.checked').forEach(label => {
        label.classList.remove('checked');
    });

    // Add the "checked" class to the label of the currently selected radio button
    selectedRadioButton.nextElementSibling.classList.add('checked');

    const selectedDay = document.querySelector('input[name="dayOfTheWeek"]:checked').value;
    
    const galwaySchedule = ClaregalwayGalwaySchedule(selectedDay);
    const claregalwaySchedule = GalwayClaregalwaySchedule(selectedDay);
  
    const galwayList = document.getElementById("claregalwayToGalway");
    const claregalwayList = document.getElementById("galwayToClaregalway");
  
    galwayList.innerHTML = ""; // Clear previous list items
    claregalwayList.innerHTML = ""; // Clear previous list items
    
    if (selectedDay === "Today") {

// Saturday hotfix start
const today = new Date();
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayOfWeek = weekdays[today.getDay()];
    
const galwaySchedule = ClaregalwayGalwaySchedule(dayOfWeek);
const claregalwaySchedule = GalwayClaregalwaySchedule(dayOfWeek);
  
const galwayList = document.getElementById("claregalwayToGalway");
const claregalwayList = document.getElementById("galwayToClaregalway");
// Saturday hotfix end

      const filteredGalwaySchedule = filterSchedule(galwaySchedule);
      const filteredClaregalwaySchedule = filterSchedule(claregalwaySchedule);
  
      filteredGalwaySchedule.forEach(entry => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<b>${entry.time}</b>`;
        galwayList.appendChild(listItem);
      });
  
      filteredClaregalwaySchedule.forEach(entry => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<b>${entry.time}</b>`;
        claregalwayList.appendChild(listItem);
      });
    } else {
      galwaySchedule.forEach(entry => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<b>${entry.time}</b>`;
        galwayList.appendChild(listItem);
      });
  
      claregalwaySchedule.forEach(entry => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<b>${entry.time}</b>`;
        claregalwayList.appendChild(listItem);
      });
    }
}

const today = new Date();
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayOfWeek = weekdays[today.getDay()];

const dayOfWeekElement = document.getElementById("dayOfWeek");
dayOfWeekElement.innerHTML = `Today is: <b>${dayOfWeek}</b>. Time is: <b>${getCurrentTime()}</b>`;

const galwaySchedule = filterSchedule(ClaregalwayGalwaySchedule(dayOfWeek));
const claregalwaySchedule = filterSchedule(GalwayClaregalwaySchedule(dayOfWeek));

const galwayList = document.getElementById("claregalwayToGalway");
const claregalwayList = document.getElementById("galwayToClaregalway");

document.querySelectorAll('input[name="dayOfTheWeek"]').forEach((radio) => {
    radio.addEventListener("change", updateSchedule);
});

updateSchedule();
