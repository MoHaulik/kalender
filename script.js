const editor = document.getElementById('editor');
const dayNameElement = document.getElementById('day-name');
const dateElement = document.getElementById('date');
const monthNameElement = document.getElementById('month-name');

const danishDays = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
const danishMonths = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];

const startDate = 6; // August 6
const startMonth = 7; // August (0-based index)
const endMonth = 8; // September (0-based index)
const year = 2024;

const canvasKeys = [];
let totalDays = 0;

for (let month = startMonth; month <= endMonth; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = month === startMonth ? startDate : 1;
    for (let day = startDay; day <= daysInMonth; day++) {
        canvasKeys.push(`canvas${year}${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`);
        totalDays++;
    }
}

let currentCanvasIndex = 0;
let typingTimer;
const typingDelay = 1000; // 1 second delay
const clickableDelay = 10000; // 10 seconds delay

const hoverSound = new Audio('Hover.wav');
const clickSound = new Audio('click.mp3');

// Load canvases from localStorage or initialize them
const canvases = canvasKeys.map(key => localStorage.getItem(key) || '');

function updateEditor() {
    let currentDay = startDate;
    let currentMonth = startMonth;
    for (let i = 0; i < currentCanvasIndex; i++) {
        currentDay++;
        if (currentDay > new Date(year, currentMonth + 1, 0).getDate()) {
            currentDay = 1;
            currentMonth++;
        }
    }
    const date = new Date(year, currentMonth, currentDay);
    dayNameElement.innerText = danishDays[date.getDay()];
    dateElement.innerText = currentDay;
    monthNameElement.innerText = danishMonths[currentMonth];
    editor.innerHTML = canvases[currentCanvasIndex];
}

function saveCurrentCanvas() {
    canvases[currentCanvasIndex] = editor.innerHTML;
    localStorage.setItem(canvasKeys[currentCanvasIndex], editor.innerHTML);
}

function translateText(text) {
    return text
        .replace(/;/g, 'æ')
        .replace(/'/g, 'ø')
        .replace(/\[/g, 'å')
        .replace(/\b(\d{2})(\d{2})\b/g, '$1.$2');
}

function setCurrentCanvasIndex() {
    const today = new Date();
    if (today >= new Date(year, startMonth, startDate) && today <= new Date(year, endMonth + 1, 0)) {
        const daysSinceStart = Math.floor((today - new Date(year, startMonth, startDate)) / (1000 * 60 * 60 * 24));
        currentCanvasIndex = Math.min(daysSinceStart, totalDays - 1);
    } else {
        currentCanvasIndex = 0;
    }
}

function showPreviousCanvas() {
    saveCurrentCanvas();
    currentCanvasIndex = (currentCanvasIndex === 0) ? canvases.length - 1 : currentCanvasIndex - 1;
    hoverSound.play();
    updateEditor();
}

function showNextCanvas() {
    saveCurrentCanvas();
    currentCanvasIndex = (currentCanvasIndex === canvases.length - 1) ? 0 : currentCanvasIndex + 1;
    hoverSound.play();
    updateEditor();
}

function makeTextClickable() {
    const textNodes = editor.childNodes;
    textNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
            const span = document.createElement('span');
            span.textContent = node.textContent;
            span.classList.add('clickable');
            node.replaceWith(span);
        }
    });
}

function handleClick(event) {
    if (event.target.classList.contains('clickable')) {
        event.target.style.textDecoration = 'line-through';
        clickSound.play();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        showPreviousCanvas();
    } else if (e.key === 'ArrowRight') {
        showNextCanvas();
    }
});

editor.addEventListener('input', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        const translatedText = translateText(editor.innerText);
        if (translatedText !== editor.innerText) {
            const cursorPosition = window.getSelection().getRangeAt(0).startOffset;
            editor.innerText = translatedText;
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(editor.childNodes[0], cursorPosition);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
        saveCurrentCanvas();
        setTimeout(makeTextClickable, clickableDelay);
    }, typingDelay);
});

dateElement.addEventListener('click', showPreviousCanvas);
dayNameElement.addEventListener('click', showNextCanvas);
editor.addEventListener('click', handleClick);

setCurrentCanvasIndex();
updateEditor();
