const editor = document.getElementById('editor');
const dayNameElement = document.getElementById('day-name');
const dateElement = document.getElementById('date');
const monthNameElement = document.getElementById('month-name');

const danishDays = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
const danishMonths = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];

const startDate = 1;
const month = 5; // June (0-based index)
const year = new Date().getFullYear();

const canvasKeys = [];
for (let day = startDate; day <= new Date(year, month + 1, 0).getDate(); day++) {
    canvasKeys.push(`canvas${day}`);
}

let currentCanvasIndex;
let typingTimer;
const typingDelay = 1000; // 1 second delay
const clickableDelay = 10000; // 10 seconds delay

const hoverSound = new Audio('Hover.wav'); // Add sound effect for navigation
const clickSound = new Audio('click.mp3'); // Add sound effect for clicking text

// Load canvases from localStorage or initialize them
const canvases = canvasKeys.map(key => localStorage.getItem(key) || '');

// Function to update the editor with the current canvas content
function updateEditor() {
    const currentDay = startDate + currentCanvasIndex;
    const date = new Date(year, month, currentDay);
    dayNameElement.innerText = danishDays[date.getDay()];
    dateElement.innerText = currentDay;
    monthNameElement.innerText = danishMonths[month];
    editor.innerHTML = canvases[currentCanvasIndex]; // Use innerHTML to preserve clickable spans
}

// Function to save the editor content to the current canvas
function saveCurrentCanvas() {
    canvases[currentCanvasIndex] = editor.innerHTML;
    localStorage.setItem(canvasKeys[currentCanvasIndex], editor.innerHTML);
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
    hoverSound.play(); // Play sound effect
    updateEditor();
}

// Function to handle navigation to the next canvas
function showNextCanvas() {
    saveCurrentCanvas();
    currentCanvasIndex = (currentCanvasIndex === canvases.length - 1) ? 0 : currentCanvasIndex + 1;
    hoverSound.play(); // Play sound effect
    updateEditor();
}

// Function to make text clickable after 10 seconds
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

// Function to handle clicking on text
function handleClick(event) {
    if (event.target.classList.contains('clickable')) {
        event.target.style.textDecoration = 'line-through';
        clickSound.play(); // Play click sound effect
    }
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
        setTimeout(makeTextClickable, clickableDelay); // Make text clickable after delay
    }, typingDelay);
});

// Event listeners for click events on date and day-name elements
dateElement.addEventListener('click', showPreviousCanvas);
dayNameElement.addEventListener('click', showNextCanvas);

// Event listener for click events on editor text
editor.addEventListener('click', handleClick);

// Initialize the editor with the correct canvas content based on the current date
setCurrentCanvasIndex();
updateEditor();
