import { width, height, canvasWidth, canvasHeight, pixelWidth } from "./globals.js"

/** 
 * [draws image to offscreen context]
 * @param {ImageDataArray} originalData [image data array to be overwritten]
 * @param {number[][]} newData [pixel data of image to be written]
 * @return {void}
 */
export function drawImage(originalData, newData) {
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