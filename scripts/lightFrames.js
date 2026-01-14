import { drawToCanvas, createImageData, createNoisyImage } from "./tools.js";
import { width, height, canvasWidth, canvasHeight, pixelWidth, galaxyImage } from "./globals.js"
let sampleCount = 10;
let drawing = false
let displayRealImage = false;
let displayAllSamples = false;
let originalData = []
let noiseSamples = []
document.getElementById("sample-count").addEventListener("change", setSampleCount);
document.getElementById("toggle-display").addEventListener("click", toggleSampleDisplay);
document.getElementById("toggle-real-image").addEventListener("click", toggleRealImage);

function toggleRealImage() {
    if (displayRealImage) {
        originalData = createImageData(100)
    } else {
        originalData = JSON.parse(JSON.stringify(galaxyImage))
    }
    displayRealImage = !displayRealImage
    refresh()
}
function refresh() {
    let original = document.getElementById("original-light");
    drawToCanvas(original, originalData);
    if (!drawing || sampleCount < 30) {
        noiseSamples = generateNoiseSamples(originalData)
        let example = document.getElementById("example-noise")
        drawToCanvas(example, noiseSamples[0])
        if (displayAllSamples) {
            addNoisyCanvases(noiseSamples)
        }
    }
    let averaged = document.getElementById("averaged");
    let averagedData = averageOutSamples(noiseSamples)
    drawToCanvas(averaged, averagedData)
}
function setSampleCount(e) {
    let value = e.target.value ? Math.min(50, Math.max(1, parseInt(e.target.value))) : 1
    e.target.value = value.toString()
    sampleCount = value;
    refresh()
}
export function toggleSampleDisplay() {
    if (displayAllSamples) {
        let container = document.getElementById("noise-container")
        container.innerHTML = ""
    } else {
        addNoisyCanvases(noiseSamples)
    }
    displayAllSamples = !displayAllSamples
}
function generateNoiseSamples(imageData) {
    let samples = []
    for (let x = 0; x < sampleCount; x++) {
        samples.push(createNoisyImage(imageData))
    }
    return samples
}
function addNoisyCanvases(samples) {
    let container = document.getElementById("noise-container")
    container.innerHTML = ""
    samples.forEach(sample => {
        let newNoiseCanvas = document.createElement("canvas")
        drawToCanvas(newNoiseCanvas, sample)
        container.appendChild(newNoiseCanvas)
    });
}
function averageOutSamples(samples) {
    let averaged = []
    let numberOfSamples = samples.length
    for (let x = 0; x < samples[0].length; x++) {
        let rs = 0
        let gs = 0
        let bs = 0
        samples.forEach(sample => {
            let [r, g, b, a] = sample[x]
            rs += r
            gs += g
            bs += b
        })
        averaged.push([rs / numberOfSamples, gs / numberOfSamples, bs / numberOfSamples, 255])
    }
    return averaged
}
function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
function mouseDraw(canvas, imageData, x, y) {
    let col = Math.floor((x / canvasWidth) * (width / pixelWidth))
    let row = Math.floor((y / canvasHeight) * (height / pixelWidth))
    let numOfCols = width / pixelWidth
    if (col < width / pixelWidth && row < height / pixelWidth) {

        imageData[col + row * numOfCols] = [160, 100, 100]
        refresh()
    }
}

function initialize() {
    let original = document.getElementById("original-light");
    let counter = document.getElementById("sample-count")
    counter.value = sampleCount
    function startDraw(e) {
        document.body.style.overflow = "hidden"
        const mousePos = getMousePos(original, e);
        let lastX = mousePos.x;
        let lastY = mousePos.y;
        mouseDraw(original, originalData, lastX, lastY)
    }
    original.addEventListener('pointerdown', (e) => {
        drawing = true
        startDraw(e)
    });
    original.addEventListener('pointermove', (e) => {
        if (drawing) {
            startDraw(e)
        }
    });
    function stopDrawing() {
        if (drawing) {
            drawing = false
            document.body.style.overflow = ""
            refresh()
        }
    }
    original.addEventListener('pointerup', stopDrawing)
    original.addEventListener('pointerleave', stopDrawing)
    originalData = createImageData(100);
    refresh()

}
initialize()