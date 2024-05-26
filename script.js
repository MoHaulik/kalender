const editor = document.getElementById('editor');
const dayNameElement = document.getElementById('day-name');
const dateElement = document.getElementById('date');
const monthNameElement = document.getElementById('month-name');

const danishDays = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
const danishMonths = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];

const startDate = 22;
const month = 4; // May (0-based index)
const year = new Date().getFullYear();

const canvasKeys = [];
for (let day = startDate; day <= new Date(year, month + 1, 0).getDate(); day++) {
    canvasKeys.push(`canvas${day}`);
}

let currentCanvasIndex;
let typingTimer;
const typingDelay = 1000; // 1 second delay

// Load canvases from localStorage or initialize them
const canvases = canvasKeys.map(key => localStorage.getItem(key) || '');

// Function to update the editor with the current canvas content
function updateEditor() {
    const currentDay = startDate + currentCanvasIndex;
    const date = new Date(year, month, currentDay);
    dayNameElement.innerText = danishDays[date.getDay()];
    dateElement.innerText = currentDay;
    monthNameElement.innerText = danishMonths[month];
    editor.innerText = canvases[currentCanvasIndex];
}

// Function to save the editor content to the current canvas
function saveCurrentCanvas() {
    canvases[currentCanvasIndex] = editor.innerText;
    localStorage.setItem(canvasKeys[currentCanvasIndex], editor.innerText);
}

// Function to translate specific text patterns
function translateText(text) {
    return text
        .replace(/;/g, 'æ')
        .replace(/'/g, 'ø')
        .replace(/\[/g, 'å')
        .replace(/\b(\d{2})(\d{2})\b/g, '$1.$2'); // Format times like 1200 to 12.00
}

// Function to set the current canvas index based on the current date
function setCurrentCanvasIndex() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();

    if (currentYear === year && currentMonth === month && currentDate >= startDate) {
        currentCanvasIndex = currentDate - startDate;
    } else {
        currentCanvasIndex = 0; // Default to the first canvas if the current date is not in the range
    }
}

// Function to handle navigation to the previous canvas
function showPreviousCanvas() {
    saveCurrentCanvas();
    currentCanvasIndex = (currentCanvasIndex === 0) ? canvases.length - 1 : currentCanvasIndex - 1;
    updateEditor();
}

// Function to handle navigation to the next canvas
function showNextCanvas() {
    saveCurrentCanvas();
    currentCanvasIndex = (currentCanvasIndex === canvases.length - 1) ? 0 : currentCanvasIndex + 1;
    updateEditor();
}

// Event listener for keydown events
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        showPreviousCanvas();
    } else if (e.key === 'ArrowRight') {
        showNextCanvas();
    }
});

// Event listener for input events to handle text translation and saving
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
    }, typingDelay);
});

// Event listeners for click events on date and day-name elements
dateElement.addEventListener('click', showPreviousCanvas);
dayNameElement.addEventListener('click', showNextCanvas);

// Initialize the editor with the correct canvas content based on the current date
setCurrentCanvasIndex();
updateEditor();
