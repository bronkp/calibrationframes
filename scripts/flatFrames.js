import { drawToCanvas, createImageData, distortSample } from "../tools.js";
import { width, height, canvasWidth, canvasHeight, pixelWidth, galaxyImage} from "../globals.js"

let originalData = []
let distorted = []

function refresh() {
    let original = document.getElementById("original-flat");

    drawToCanvas(original, originalData);
    distorted = distortSample(originalData, 160)

    let example = document.getElementById("example-vignette")
    drawToCanvas(example, distorted)

}
function initialize() {
    let original = document.getElementById("original-flat");

    original.addEventListener('mousedown', (e) => {
        // Update the starting position to where the mouse was clicked
        const mousePos = getMousePos(original, e);
        let lastX = mousePos.x;
        let lastY = mousePos.y;
        mouseDraw(original, originalData, lastX, lastY)
    });
    originalData = createImageData(200);
    refresh()

}
initialize()