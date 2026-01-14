import { drawImage } from "./tools.js";
import {width,height, canvasWidth, canvasHeight, pixelWidth} from "./globals.js"
let sampleCount = 10;

    let displayAllSamples = false;
    let originalData = []
    let noiseSamples = []
    document.getElementById("sample-count").addEventListener("change", setSampleCount);
    document.getElementById("toggle-display").addEventListener("click", toggleSampleDisplay);

    function refresh() {

        drawToCanvas(original, originalData);
        noiseSamples = generateNoiseSamples(originalData)
        if (displayAllSamples) {
            addNoisyCanvases(noiseSamples)
        }
        let example = document.getElementById("example-noise")
        drawToCanvas(example, noiseSamples[0])
        let averaged = document.getElementById("averaged");
        let averagedData = averageOutSamples(noiseSamples)
        drawToCanvas(averaged, averagedData)
    }
    function setSampleCount(e) {
        let value = Math.min(50, Math.max(1, parseInt(e.target.value)))
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
    function createImageData() {
        let image = []
        let rows = height / pixelWidth;
        let cols = width / pixelWidth;
        for (let x = 0; x < rows * cols; x++) {
            image.push([100, 100, 100]);
        }
        return image
    }
    /** 
     * [creates a noisy version of an image]
     * @param {number[][]} imageData [original pixel data to make a noisy version of]
     * @return {void}
     */
    function createNoisyImage(imageData) {
        let noiseFactor = 60
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
    function drawToCanvas(canvas, image) {
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
        imageData[col + row * numOfCols] = [160, 100, 100]
        noiseSamples = generateNoiseSamples(imageData)
        if (displayAllSamples) {
            addNoisyCanvases(noiseSamples)
        }
        refresh()
    }

    function initialize() {
        let original = document.getElementById("original");

        original.addEventListener('mousedown', (e) => {
            // Update the starting position to where the mouse was clicked
            const mousePos = getMousePos(original, e);
            let lastX = mousePos.x;
            let lastY = mousePos.y;
            mouseDraw(original, originalData, lastX, lastY)
        });
        originalData = createImageData();
        refresh()

    }
    initialize()