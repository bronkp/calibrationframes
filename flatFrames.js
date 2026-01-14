import { drawToCanvas, createImageData } from "./tools.js";
import { width, height, canvasWidth, canvasHeight, pixelWidth } from "./globals.js"

let originalData = []
let distorted = []
function vignette(pixel, x, y) {
    let center = [width / 2 / pixelWidth, height / 2 / pixelWidth]
    let maxDistance = 160;
    let distance = Math.hypot(x - center[0], y - center[1])
    let darken = 1 - (distance / maxDistance)
    pixel[0] = Math.min(Math.max(pixel[0] * darken, 0), 255)
    pixel[1] = Math.min(Math.max(pixel[1] * darken, 0), 255)
    pixel[2] = Math.min(Math.max(pixel[2] * darken, 0), 255)
}
function distortSample(data) {
    let y = 0;
    let newDistorted = []
    for (let i = 0; i < data.length; i++) {
        let pixel = data[i]
        let x = i % (width / pixelWidth);
        vignette(pixel, x, y)
        newDistorted.push(pixel)
        if (x == 0) {
            y++;
        }
    }
    return newDistorted
}
function refresh() {
    let original = document.getElementById("original-flat");

    drawToCanvas(original, originalData);
    distorted = distortSample(originalData)

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