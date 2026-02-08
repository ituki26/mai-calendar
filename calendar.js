const calendarDates = document.querySelector('.calendar-dates');
const monthYear = document.getElementById('month-year');
const prevButton = document.getElementById('previous-month');
const nextButton = document.getElementById('next-month');
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const clearBtn = document.getElementById('clearBtn');

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function renderCalendar(month, year) {
	
	window.currentMonthKey = `${year}-${month+1}`;
	window.calendarData = loadData(window.currentMonthKey);
	
	calendarDates.innerHTML = '';
	monthYear.textContent = `${months[month]} ${year}`;
	
	const firstDate = new Date(year, month, 1).getDay();
	const daysOfMonth = new Date(year, month + 1, 0).getDate();
	
	if(firstDate == 0){
		var blankDays = 7;
	}
	else{
		var blankDays = firstDate;
	}
  
	for (let i = 1; i < blankDays; i++) {
		const blank = document.createElement('div');
		calendarDates.appendChild(blank);
	}

	for (let i = 1; i <= daysOfMonth; i++) {
		const day = document.createElement('div');
		day.classList.add('dates');
		const dayNumber = document.createElement('div');
		const dateKey = `${year}-${month+1}-${i}`;
		day.dataset.date = dateKey;
	    dayNumber.textContent = i;
		dayNumber.classList.add('dates-text');
		var date = new Date(year, month, i);
		if (date.toDateString() === currentDate.toDateString()){
			day.id = 'today';
			dayNumber.textContent = i + ' 今日';
		}
		else if(date < currentDate){
			day.id = 'past';
		}
		day.appendChild(dayNumber);
	    calendarDates.appendChild(day);
		
		const drop = document.createElement('div');
		drop.classList.add('dropzones');
		
		day.appendChild(drop);
		
		if(month - 1 < 0){
			var prevMonth = 11;
			var prevYear = year - 1;
			var nextMonth = month + 1;
			var nextYear = year;
		}
		
		else if(month + 1 > 11){
			var prevMonth = month - 1;
			var prevYear = year;
			var nextMonth = 0;
			var nextYear = year +1;
		}
		else{
			var prevMonth = month - 1;
			var prevYear = year;
			var nextMonth = month + 1;
			var nextYear = year;
		}
	prevButton.textContent = `${months[prevMonth]} ${prevYear}`;
	nextButton.textContent = `${months[nextMonth]} ${nextYear}`;
  }
  retrieveEvents();
  initDropzones();
}

renderCalendar(currentMonth, currentYear);

clearBtn.addEventListener('click', () => {
	localStorage.removeItem('calendarData');
	calendarData = {};
	console.log(calendarData);
	renderCalendar(currentMonth, currentYear);
})

prevButton.addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) { //Dec < Jan
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
});

nextButton.addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) { //Dec > Jan
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
});