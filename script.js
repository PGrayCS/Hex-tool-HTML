const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const hexCode = document.getElementById('hexCode');
const clearCanvas = document.getElementById('clearCanvas');

const pixelSize = 20; // Adjusted pixel size for better visibility

// Draw the grid on the canvas
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#ccc'; // Light grey grid lines

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

// Initial grid draw
drawGrid();

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / pixelSize) * pixelSize;
    const y = Math.floor((event.clientY - rect.top) / pixelSize) * pixelSize;

    ctx.fillStyle = colorPicker.value;
    ctx.fillRect(x, y, pixelSize, pixelSize);
    ctx.strokeStyle = '#ccc'; // Redraw grid lines on top
    ctx.strokeRect(x, y, pixelSize, pixelSize);
});

colorPicker.addEventListener('input', () => {
    hexCode.value = colorPicker.value;
});

hexCode.addEventListener('input', () => {
    if(/^#[0-9A-F]{6}$/i.test(hexCode.value)) {
        colorPicker.value = hexCode.value;
    }
});

clearCanvas.addEventListener('click', () => {
    drawGrid();
});