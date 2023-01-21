/* --------------------------------------------------------------
Script: mlc.js
Author: Adriel Dubé
Version: 1.0.0

Description:
iOS widget for Mercado Informal de Divisas en Cuba

Changelog:
1.0.0: Initialization
-------------------------------------------------------------- */
const widgetUrl = 'https://eltoque.com/tasas-de-cambio-de-moneda-en-cuba-hoy';
const apiUrl = `https://api.cambiocuba.money/api/v1/x-rates-by-date-range?trmi=true&period=1D`;
const currencies = ['ECU', 'USD', 'MLC'];
const images = [
    {
        name: 'eur',
        url: 'https://adrieldube.github.io/mlc/img/eur.png'
    },
    {
        name: 'usd',
        url: 'https://adrieldube.github.io/mlc/img/usd.png'
    },
    {
        name: 'mlc',
        url: 'https://adrieldube.github.io/mlc/img/mlc.png'
    },
    {
        name: 'el-toque',
        url: 'https://adrieldube.github.io/mlc/img/el-toque.png'
    }];

const data = await getRates();
const resources = await getResources();

let widget = createWidget(data, widgetUrl);
if (config.runsInWidget) {
    // create and show widget
    Script.setWidget(widget);
    Script.complete();
}
else {
    widget.presentMedium();
}

// Assemble widget layout
function createWidget(data, widgetUrl) {
    const { USD, ECU, MLC } = data;

    let w = new ListWidget();
    w.backgroundColor = new Color('#FFCC00');
    w.setPadding(0, 0, 0, 0);
    w.url = widgetUrl;

    // header

    let staticText = w.addText('Informal Currency Exchange in Cuba');
    staticText.textColor = new Color('#003399');
    staticText.font = Font.boldSystemFont(16);
    staticText.centerAlignText();
    w.addSpacer(2);

    // body

    let image = w.addImage(getImage('usd'));
    image.imageSize = new Size(33, 33);
    image.centerAlignImage();

    let eurText = w.addText(`1 EUR - ${format(ECU)} CUP`);
    eurText.textColor = Color.white();
    eurText.font = Font.boldSystemFont(24);
    eurText.centerAlignText();

    w.addSpacer(2);

    let usdText = w.addText(`1 USD - ${format(USD)} CUP`);
    usdText.textColor = Color.white();
    usdText.font = Font.boldSystemFont(24);
    usdText.centerAlignText();

    w.addSpacer(2);

    let mlcText = w.addText(`1 MLC - ${format(MLC)} CUP`);
    mlcText.textColor = Color.white();
    mlcText.font = Font.boldSystemFont(24);
    mlcText.centerAlignText();

    w.addSpacer(2);

    // footer

    const date = new Date();
    const df = new DateFormatter();
    df.useFullDateStyle();

    const hf = new DateFormatter();
    hf.useShortTimeStyle();

    const dateText = w.addText(`${df.string(date)} ${hf.string(date)}`);
    dateText.textColor = new Color('#003399');
    dateText.font = Font.semiboldSystemFont(10);
    dateText.centerAlignText();

    return w;
}

async function getRate(currency) {
    const url = `${apiUrl}&cur=${currency}`;
    const req = new Request(url);
    const res = await req.loadJSON();
    const { min, max, avg, median } = res[res.length - 1];
    console.log(`${currency} - Min: ${min}, Max: ${max}, Avg: ${avg}, Median: ${median}`);

    return avg;
}

async function getRates() {
    const rates = {};
    for (const currency of currencies) {
        const r = await getRate(currency);
        rates[currency] = r;
    }
    return rates;
}

async function getResources() {
    const result = {};

    for (const r of images) {
        const { name, url } = r;
        console.log(name, url);
        const req = new Request(url);
        const res = await req.loadImage();
        result[name] = res;
    }

    return result;
}

function getImage(id) {
    return resources[id];
}

function format(v) {
    return Math.round(Number.parseFloat(v)).toFixed(2);
}

