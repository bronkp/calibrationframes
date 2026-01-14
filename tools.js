import { width, height, canvasWidth, canvasHeight, pixelWidth } from "./globals.js"

/** 
 * [draws image to offscreen context]
 * @param {ImageDataArray} originalData [image data array to be overwritten]
 * @param {number[][]} newData [pixel data of image to be written]
 * @return {void}
 */
function drawImage(originalData, newData) {
    let rows = height / pixelWidth;
    let cols = width / pixelWidth;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            let pixel = x + y * cols
            let [r, g, b] = newData[pixel]
            drawSquare(originalData, r, g, b, x, y)
        }
    }
}

/** 
     * [draws square to image data array with given pixel size]
     * @param {ImageDataArray} originalData [image data array to be overwritten]
     * @param {number} r [red]
     * @param {number} g [green]
     * @param {number} b [blue]
     * @param {number} originX [pixel's x, not accounting for size of pixel]
     * @param {number} originY [pixel's y, not accounting for size of pixel]
     * @return {void}
     */
function drawSquare(data, r, g, b, originX, originY) {
    let baseShift = originX * pixelWidth * 4 + originY * pixelWidth * 4 * width
    for (let y = 0; y < pixelWidth; y++) {
        for (let x = 0; x < pixelWidth; x++) {
            let posShift = baseShift + x * 4 + y * 4 * width
            data[posShift] = r
            data[posShift + 1] = g
            data[posShift + 2] = b
            data[posShift + 3] = 255
        }
    }
}
export function createImageData(val) {
    let image = []
    let rows = height / pixelWidth;
    let cols = width / pixelWidth;
    for (let x = 0; x < rows * cols; x++) {
        image.push([val, val, val]);
    }
    return image
}
export function drawToCanvas(canvas, image) {
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    let ctx = canvas.getContext("2d")
    ctx.width = width
    ctx.height = height
    let offscreenCanvas = document.createElement("canvas")
    offscreenCanvas.width = width
    offscreenCanvas.height = height
    let offscreenCTX = offscreenCanvas.getContext("2d")
    let imageData = offscreenCTX.createImageData(width, height)
    let data = imageData.data
    drawImage(data, image)
    offscreenCTX.putImageData(imageData, 0, 0)
    ctx.drawImage(offscreenCanvas, 0, 0)
}
/** 
* [creates a noisy version of an image]
* @param {number[][]} imageData [original pixel data to make a noisy version of]
* @return {void}
*/
export function createNoisyImage(imageData) {
    let noiseFactor = 80
    let noisy = JSON.parse(JSON.stringify(imageData))
    for (let x = 0; x < noisy.length; x++) {
        let pixel = noisy[x]

        //lets noise be + or -
        let nr = Math.random() * noiseFactor - noiseFactor / 2

        let ng = Math.random() * noiseFactor - noiseFactor / 2
        let nb = Math.random() * noiseFactor - noiseFactor / 2
        pixel[0] = Math.min(Math.max(pixel[0] + nr, 0), 255)
        pixel[1] = Math.min(Math.max(pixel[1] + ng, 0), 255)
        pixel[2] = Math.min(Math.max(pixel[2] + nb, 0), 255)
    }
    return noisy
}
function vignette(pixel, x, y, maxDistance) {
    let center = [width / 2 / pixelWidth, height / 2 / pixelWidth]
    let distance = Math.hypot(x - center[0], y - center[1])
    let darken = 1 - (distance / maxDistance)
    pixel[0] = Math.min(Math.max(pixel[0] * darken, 0), 255)
    pixel[1] = Math.min(Math.max(pixel[1] * darken, 0), 255)
    pixel[2] = Math.min(Math.max(pixel[2] * darken, 0), 255)
}
export function distortSample(data, maxDistance) {
    let y = 0;
    let newDistorted = []
    for (let i = 0; i < data.length; i++) {
        let pixel = data[i]
        let x = i % (width / pixelWidth);
        vignette(pixel, x, y, maxDistance)
        newDistorted.push(pixel)
        if (x == 0) {
            y++;
        }
    }
    return newDistorted
}