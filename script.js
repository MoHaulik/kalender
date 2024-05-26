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

let currentCanvasIndex = 0;
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

// Event listener for keydown events
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        saveCurrentCanvas();
        if (e.key === 'ArrowLeft') {
            currentCanvasIndex = (currentCanvasIndex === 0) ? canvases.length - 1 : currentCanvasIndex - 1;
        } else if (e.key === 'ArrowRight') {
            currentCanvasIndex = (currentCanvasIndex === canvases.length - 1) ? 0 : currentCanvasIndex + 1;
        }
        updateEditor();
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

// Initialize the editor with the first canvas content
updateEditor();
