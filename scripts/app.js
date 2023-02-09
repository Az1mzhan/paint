// Import statements
import Brush from "./brush.js"; // Brush class
import brushTools from "./brushTools.js"; // Enumerator for brush tools
import paletteRenderMode from "./paletteRenderMode.js"; // Enumerator for palette block rendering
import parseColor from "./parseColor.js"; // Function for parsing default rgb string to int array (e.g. rgb(255, 255, 255) => [255, 255, 255])
import floodFill from "./fillTool.js" // Methods for Fill tool

// Global variables for canvas
let canvas, context, canvasUpd, contextUpd, container;
/*
    In order:
    1 - canvas element;
    2 - context of canvas (2d);
    3 - updated context for canvas (when mouse button is pressed);
    4 - div container of canvas;
*/

let isStarted = false; // Boolean variable for mouse events

let mainBrush = new Brush('rgb(255, 255, 255)', 1, brushTools.BRUSH); // Object of Brush class

// GET request for colors' palette
const domReq = () => {
    fetch('https://my-json-server.typicode.com/Az1mzhan/paint-server/colors', { // JSON server
        method: 'GET'
    })
        .then(data => data.json())
        .then(el => { // This GET requests extracts colors and creates a color palette
            for (let i = 0; i < el.length; ++i) {
                let col_btn = document.createElement('button');
                col_btn.style.backgroundColor = el[i].hex;
                col_btn.className = 'color-btn';
                document.getElementById('paint-palette-block').appendChild(col_btn);
            }
        })
        .then(() => {
            let colorButtons = document.querySelectorAll('.color-btn');
            for (let elem of colorButtons) {
                elem.addEventListener('click', () => {
                    mainBrush.setColor(elem.style.backgroundColor);
                    document.querySelector('#main-color-btn').style.backgroundColor = mainBrush.getColor();
                })
            }
        });
}

const init = () => {
    let newCanvas = document.createElement('canvas');
    newCanvas.id = 'canvas-updated'
    container.appendChild(newCanvas);
}

const paletteRender = () => {
    let paintPaletteBlock = document.getElementById('paint-palette-block');
    paintPaletteBlock.innerHTML = '';
    let renderMode = (window.innerWidth > 991) ? paletteRenderMode.SCREEN : paletteRenderMode.PHONE;
    let colorButtons = document.getElementsByClassName('color-btn');

    if (renderMode === paletteRenderMode.PHONE) {
        let colorTemp = document.createElement('canvas');
        let colorRange = document.createElement('input');

        colorRange.id = 'color-range';
        colorRange.type = 'range';
        colorRange.min = '0';
        colorRange.max = '19';
        colorRange.value = '0';

        colorTemp.width = paintPaletteBlock.offsetWidth * 0.375;
        colorRange.style.width = colorTemp.width + 'px';
        colorTemp.height = paintPaletteBlock.offsetWidth * 0.375;
        colorTemp.id = 'color-diagram';
        paintPaletteBlock.style.flexDirection = 'column';
        paintPaletteBlock.appendChild(colorTemp);
        paintPaletteBlock.appendChild(colorRange);

        let colorDiagram = document.getElementById('color-diagram');
        let cdCTX = colorDiagram.getContext('2d');
        let vertGradient = cdCTX.createLinearGradient(0, 0, 0, colorDiagram.height);
        vertGradient.addColorStop(0, 'white');
        vertGradient.addColorStop(1, 'black');
        cdCTX.fillStyle = vertGradient;
        cdCTX.fillRect(0, 0, colorDiagram.width, colorDiagram.height);
    }
    else if (renderMode === paletteRenderMode.SCREEN) {
        if (colorButtons.length === 0)
            domReq();
    }
}

const canvasAdjust = (canv1, canv2, container) => {
    canv1.width = container.offsetWidth;
    canv1.height = container.offsetHeight;

    canv2.width = container.offsetWidth;
    canv2.height = container.offsetHeight;
}

document.addEventListener('DOMContentLoaded', () => {
    paletteRender();

    container = document.getElementById('canvas');

    canvas = document.getElementById('main-canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    context = canvas.getContext('2d');

    init();

    canvasUpd = document.getElementById('canvas-updated');
    canvasUpd.width = container.offsetWidth;
    canvasUpd.height = container.offsetHeight;
    contextUpd = canvasUpd.getContext('2d');

    container.addEventListener('mousedown', (e) => {
        let x = e.pageX - container.offsetLeft;
        let y = e.pageY - container.offsetTop;

        if (mainBrush.getTool() === brushTools.ERASER)
            mainBrush.setColor(window.getComputedStyle(container, null).getPropertyValue("background-color"));

        contextUpd.strokeStyle = mainBrush.getColor();
        contextUpd.lineWidth = mainBrush.getSize();

        contextUpd.beginPath();
        contextUpd.moveTo(x, y);
        isStarted = true;
    })

    container.addEventListener('click', (e) => {
        let x = e.pageX - container.offsetLeft;
        let y = e.pageY - container.offsetTop;

        if (mainBrush.getTool() === brushTools.FILL) {
            floodFill(contextUpd, x, y, parseColor(mainBrush.getColor()), 128);
        }
        else if (mainBrush.getTool() === brushTools.TEXT) {
            contextUpd.font = `${20 * mainBrush.getSize()}px Montserrat`;
            contextUpd.fillStyle = mainBrush.getColor();
            contextUpd.fillText('Hello, world!', x, y);
        }
    })

    container.addEventListener('mousemove', (e) => {
        let x = e.pageX - container.offsetLeft;
        let y = e.pageY - container.offsetTop;

        if (isStarted && (mainBrush.getTool() === brushTools.BRUSH || mainBrush.getTool() === brushTools.ERASER)) {
            contextUpd.lineTo(x, y);
            contextUpd.stroke();
        }
    });

    container.addEventListener('mouseup', (e) => {
        isStarted = false;
    })

    let szRange = document.getElementById('brush-sz-range');
    szRange.addEventListener('input', () => {
      mainBrush.setSize(szRange.value);
    })

    document.getElementById('brush-btn').addEventListener('click', () => {
        mainBrush.setTool(brushTools.BRUSH);
    })

    document.getElementById('eraser-btn').addEventListener('click', () => {
        mainBrush.setTool(brushTools.ERASER);
    })

    document.getElementById('fill-btn').addEventListener('click', () => {
        mainBrush.setTool(brushTools.FILL);
    })

    document.getElementById('text-btn').addEventListener('click', () => {
        mainBrush.setTool(brushTools.TEXT);
    })

    window.addEventListener('resize', () => {
        canvasAdjust(canvas, canvasUpd, container);

        paletteRender();
    })
})