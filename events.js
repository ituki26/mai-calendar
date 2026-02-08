const eventItems = ['資格試験', '予定', '課題']
const eventColors = ['blue', 'yellow', 'green']
const STORAGE_KEY = "calendarData";

function saveData(monthKey){
	const all = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
	all[monthKey] = calendarData;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
	console.log(calendarData);
}

function loadData(monthKey){
	const all = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
	return all[monthKey] || {};
}

window.calendarData = {};
window.currentMonthKey = null;

function initDrag() {
    interact('.event').unset();

    interact('.event').draggable({
        listeners: {
			start(event) {
				const target = event.target;
				target._startX = parseFloat(target.getAttribute('data-x')) || 0;
				target._startY = parseFloat(target.getAttribute('data-y')) || 0;
			},
            move(event) {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                target.style.transform = `translate(${x}px, ${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            },
			end(event){
				if(!event.dropzone){
					const target = event.target;
					target.remove();
					
					createEvent();
				}
			}
        }
    });
}

window.initDropzones = function initDropzones(){
	interact('.dropzones').unset(); 
	
	interact('.dropzones').dropzone({
		accept: '.event',
		ondrop(event){
			const targetDrop = event.target;
			const dragEvent = event.relatedTarget;
			
			if(!dragEvent.id || dragEvent.id.startsWith('event-')){
			  	dragEvent.dataset.uid = crypto.randomUUID();
			  	dragEvent.id = 'placed';
			}

			targetDrop.appendChild(dragEvent);
			dragEvent.style.transform = 'translate(0, 0)';
			dragEvent.setAttribute('data-x', 0);
			dragEvent.setAttribute('data-y', 0);
			
			const title = dragEvent.querySelector('.title').textContent;
			const text = dragEvent.querySelector('.content').textContent;
			
			const full = targetDrop.parentElement.dataset.date;
			const newDay = full.split('-')[2];
			const oldDay = dragEvent.dataset.day;

			if(oldDay && calendarData[oldDay]){
			  calendarData[oldDay] =
			    calendarData[oldDay].filter(e => e.uid !== dragEvent.dataset.uid);

			  if(calendarData[oldDay].length === 0) delete calendarData[oldDay];
			}
			
			if(!calendarData[newDay]) calendarData[newDay] = [];
			calendarData[newDay].push({ uid: dragEvent.dataset.uid, title, text });

			dragEvent.dataset.day = newDay;
			
			saveData(window.currentMonthKey);			
			createEvent();
			initDrag();
		},
	});	
}

function initDelzone(){
	interact('.delete').dropzone({
		accept: '.event',
		ondrop(event){
			const dragEvent = event.relatedTarget;
			
			
			for(const d in calendarData){
				calendarData[d] = calendarData[d].filter(e => e.uid !== dragEvent.dataset.uid);
				if(calendarData[d].length === 0) delete calendarData[d];
			}
			
			saveData(window.currentMonthKey);		
			dragEvent.remove();
			createEvent();
		},
	});
}

function createEvent(){
	
	const eventList = document.getElementById('event-list');
	
	eventItems.forEach((item, index) => {
		const currID = `event-${index}`;
		
		const currentTarget = document.getElementById(currID);
		if(currentTarget){
			const existingLi = currentTarget.parentElement;
			
			if(eventList.children[index] !== existingLi){
				eventList.insertBefore(existingLi, eventList.children[index] || null )
			}
			return;
		}
		
		const newListItem = document.createElement('li');
		const newEvent = document.createElement('div');
		const newTitle = document.createElement('div');
		const newContent = document.createElement('p');
		
		newEvent.id = currID;
		newEvent.classList.add('event');
		newEvent.dataset.type = index;
		
		newTitle.classList.add('title');
		newTitle.style.backgroundColor = 'none';
		newTitle.textContent = item;
		
		newContent.classList.add('content');
		newContent.style.display = 'none';
		newContent.contentEditable = 'true';
		newContent.addEventListener('blur', () => saveText(newContent));
		newContent.textContent = "内容";
		
		newTitle.addEventListener('click', displayContent);

		newEvent.appendChild(newTitle);
		newEvent.appendChild(newContent);
		newListItem.appendChild(newEvent);	
		eventList.insertBefore(newListItem, eventList.children[index] || null);
	});
}

window.retrieveEvents = function retrieveEvents(){
	console.log('Retrieving event data...')
	console.log(calendarData);
	document.querySelectorAll('.dropzones .event').forEach(e => e.remove());
	
	for(const date in calendarData){
		const full = `${window.currentMonthKey}-${date}`;
		const targetDate = document.querySelector(`[data-date="${full}"]`);
		if(!targetDate) continue;
		
		const placement = targetDate.querySelector('.dropzones');
		
		calendarData[date].forEach(data =>{
			const event = document.createElement('div');
			event.className = 'event';
			event.id = 'placed';
			event.dataset.uid = data.uid;
			event.dataset.day = date;
			
			const title = document.createElement('div');
			title.className = 'title';
			title.textContent = data.title;
			title.addEventListener('click', displayContent);
			
			const text = document.createElement('p');
			text.className = 'content';
			text.contentEditable = true;
			text.addEventListener('blur', () => saveText(text));
			text.textContent = data.text;
			text.style.display = 'none';
			
			event.append(title, text);  
			placement.appendChild(event);
		})
	}
	
	initDrag();
}

function saveText(p){
	const event = p.parentElement;
	const uid = event.dataset.uid;
	const day = event.dataset.day;
	
	if(!uid) return;
	
	const text = p.textContent;
	const list = calendarData[day];
	if(!list) return;
	
	const obj = list.find(e => e.uid === uid);
	if(obj){
		obj.text = text;
		saveData(window.currentMonthKey);
	}
}

function displayContent(event){
	const btn = event.currentTarget;
	const content = btn.nextElementSibling;
	content.style.display = content.style.display === "block" ? "none" : "block";
}

window.onload = () => {
	createEvent();
	initDrag();
	initDropzones();
	initDelzone();
}