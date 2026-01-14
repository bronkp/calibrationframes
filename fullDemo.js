import { drawToCanvas, createImageData, distortSample, createNoisyImage} from "./tools.js";
import { width, height, canvasWidth, canvasHeight, pixelWidth, nebula} from "./globals.js"
let originalData = []
let samples = []
let displayAllSamples = false
function refresh() {
    let original = document.getElementById("original-demo");
    drawToCanvas(original, nebula);
    let distorted = document.getElementById("distorted-demo");
    drawToCanvas(distorted, samples[0]);

}
function generateRawSamples(){
    let count = 10;
    for (let x=0;x<count;x++){
     samples.push(distortSample(createNoisyImage(nebula),110))   
    }
}
function initialize() {
    let original = document.getElementById("original-demo");

    original.addEventListener('mousedown', (e) => {
        // Update the starting position to where the mouse was clicked
        const mousePos = getMousePos(original, e);
        let lastX = mousePos.x;
        let lastY = mousePos.y;
        mouseDraw(original, originalData, lastX, lastY)
    });
    originalData = createImageData(200);
    generateRawSamples()
    refresh()

}
document.getElementById("toggle-demo-raw").addEventListener("click", toggleSampleDisplay);
function addRawCanvases(samples) {
        let container = document.getElementById("demo-raw-samples")
        container.innerHTML = ""
        samples.forEach(sample => {
            let newNoiseCanvas = document.createElement("canvas")
            drawToCanvas(newNoiseCanvas, sample)
            container.appendChild(newNoiseCanvas)
        });
    }
function toggleSampleDisplay() {
        if (displayAllSamples) {
            let container = document.getElementById("demo-raw-samples")
            container.innerHTML = ""
        } else {
            addRawCanvases(samples)
        }
        displayAllSamples = !displayAllSamples
    }
initialize()