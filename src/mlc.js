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

    const w = new ListWidget();
    w.backgroundColor = new Color('#FFCC00');
    w.setPadding(0, 0, 0, 0);
    w.url = widgetUrl;

    // header

    const staticText = w.addText('Informal Currency Exchange in Cuba');
    staticText.textColor = new Color('#003399');
    staticText.font = Font.boldSystemFont(16);
    staticText.centerAlignText();
    w.addSpacer(2);

    // body

    const mainStack = w.addStack();
    mainStack.useDefaultPadding();

    const leftStack = mainStack.addStack();
    leftStack.layoutVertically();
    leftStack.centerAlignContent();
    leftStack.borderColor = Color.red();
    leftStack.borderWidth = 1;

    // usd
    const usdStack = leftStack.addStack();
    usdStack.layoutHorizontally();
    usdStack.centerAlignContent();
    usdStack.spacing = 6;

    let usdText = usdStack.addText('1 USD');
    usdText.textColor = Color.white();
    usdText.font = Font.boldSystemFont(22);

    const usdImage = usdStack.addImage(getImage('usd'));
    usdImage.imageSize = new Size(36, 36);

    usdStack.addSpacer(2);

    // eur
    const eurStack = leftStack.addStack();
    eurStack.layoutHorizontally();
    eurStack.centerAlignContent();
    eurStack.spacing = 4;

    const eurText = eurStack.addText('1 EUR');
    eurText.textColor = Color.white();
    eurText.font = Font.boldSystemFont(22);

    let eurImage = eurStack.addImage(getImage('eur'));
    eurImage.imageSize = new Size(36, 36);

    eurStack.addSpacer(2);

    // mlc
    const mlcStack = leftStack.addStack();
    mlcStack.layoutHorizontally();
    mlcStack.centerAlignContent();
    mlcStack.spacing = 4;

    const mlcText = mlcStack.addText('1 MLC');
    mlcText.textColor = Color.white();
    mlcText.font = Font.boldSystemFont(22);

    const mlcImage = mlcStack.addImage(getImage('mlc'));
    mlcImage.imageSize = new Size(36, 36);

    mlcStack.addSpacer(2);

    const centerStack = mainStack.addStack();

    mainStack.addSpacer(2);

    const rightStack = mainStack.addStack();
    rightStack.layoutVertically();
    rightStack.centerAlignContent();
    rightStack.borderColor = Color.blue();
    rightStack.borderWidth = 1;

    let usdRateText = rightStack.addText(`${format(USD)} CUP`);
    usdRateText.textColor = Color.white();
    usdRateText.font = Font.boldSystemFont(22);

    rightStack.addSpacer(2);

    let eurRateText = rightStack.addText(`${format(ECU)} CUP`);
    eurRateText.textColor = Color.white();
    eurRateText.font = Font.boldSystemFont(22);

    rightStack.addSpacer(2);

    let mlcRateText = rightStack.addText(`${format(MLC)} CUP`);
    mlcRateText.textColor = Color.white();
    mlcRateText.font = Font.boldSystemFont(22);

    rightStack.addSpacer(2);

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

