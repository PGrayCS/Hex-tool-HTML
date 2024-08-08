const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const hexCode = document.getElementById('hexCode');
const clearCanvas = document.getElementById('clearCanvas');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const canvasContainer = document.getElementById('canvas-container');

let pixelSize = 20;
let canvasSize = 500;
let currentColor = '#000000';
let undoStack = [];
let redoStack = [];

function resizeCanvas() {
    const containerWidth = canvasContainer.clientWidth;
    canvasSize = Math.min(containerWidth, 500);
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    pixelSize = Math.floor(canvasSize / 25); // Fixed 25x25 grid
    redrawCanvas();
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    undoStack.forEach(action => {
        ctx.fillStyle = action.color;
        ctx.fillRect(action.x, action.y, pixelSize, pixelSize);
    });
}

function drawGrid() {
    ctx.strokeStyle = '#ccc';
    for (let x = 0; x <= canvas.width; x += pixelSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += pixelSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function updateColor() {
    let hexValue = hexCode.value;
    // If the user didn't type the #, add it
    if (hexValue.charAt(0) !== '#') {
        hexValue = '#' + hexValue;
    }
    // Pad the hex value if it's too short
    while (hexValue.length < 7) {
        hexValue += '0';
    }
    if (/^#[0-9A-F]{6}$/i.test(hexValue)) {
        currentColor = hexValue;
        colorPicker.value = hexValue;
        hexCode.value = hexValue;
    } else {
        // Only show alert if the hex code is complete but invalid
        if (hexValue.length === 7) {
            alert("Invalid hex code. Please use the format #RRGGBB");
            hexCode.value = currentColor;
        }
    }
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((event.clientX - rect.left) * scaleX / pixelSize) * pixelSize;
    const y = Math.floor((event.clientY - rect.top) * scaleY / pixelSize) * pixelSize;

    ctx.fillStyle = currentColor;
    ctx.fillRect(x, y, pixelSize, pixelSize);
    ctx.strokeStyle = '#ccc';
    ctx.strokeRect(x, y, pixelSize, pixelSize);

    undoStack.push({ x, y, color: currentColor });
    redoStack = [];
});

colorPicker.addEventListener('input', () => {
    currentColor = colorPicker.value;
    hexCode.value = currentColor;
});

hexCode.addEventListener('input', () => {
    if (hexCode.value.length === 7) {
        updateColor();
    }
});

hexCode.addEventListener('blur', updateColor);

clearCanvas.addEventListener('click', () => {
    undoStack = [];
    redoStack = [];
    redrawCanvas();
});

undoBtn.addEventListener('click', () => {
    if (undoStack.length > 0) {
        const action = undoStack.pop();
        redoStack.push(action);
        redrawCanvas();
    }
});

redoBtn.addEventListener('click', () => {
    if (redoStack.length > 0) {
        const action = redoStack.pop();
        undoStack.push(action);
        ctx.fillStyle = action.color;
        ctx.fillRect(action.x, action.y, pixelSize, pixelSize);
        ctx.strokeStyle = '#ccc';
        ctx.strokeRect(action.x, action.y, pixelSize, pixelSize);
    }
});

window.addEventListener('resize', resizeCanvas);

resizeCanvas();