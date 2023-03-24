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
];

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

function createWidget(data, widgetUrl) {
    if (config.widgetFamily === 'small') {
        return createSmallWidget(data, widgetUrl);
    }
    return createMediumWidget(data, widgetUrl);
}

// Assemble medium widget layout
function createMediumWidget(data, widgetUrl) {
    const { USD, ECU, MLC } = data;

    const w = new ListWidget();
    w.backgroundColor = new Color('#FFCC00');
    w.url = widgetUrl;

    // header
    const staticText = w.addText('Informal Currency Exchange in Cuba');
    staticText.textColor = new Color('#003399');
    staticText.font = Font.boldSystemFont(16);
    staticText.centerAlignText();

    // body
    const mainStack = w.addStack();
    mainStack.layoutVertically();
    mainStack.topAlignContent();
    mainStack.borderColor = Color.black();
    //mainStack.borderWidth = 1;

    // eur
    const eurStack = mainStack.addStack();
    eurStack.layoutHorizontally();
    eurStack.centerAlignContent();
    eurStack.borderColor = Color.red();
    //eurStack.borderWidth = 1;
    //eurStack.spacing = 6;

    eurStack.addSpacer();

    const eurText = eurStack.addText('EUR');
    eurText.textColor = Color.white();
    eurText.font = Font.boldMonospacedSystemFont(22);

    eurStack.addSpacer(10);

    const eurImage = eurStack.addImage(getImage('eur'));
    eurImage.imageSize = new Size(36, 36);

    eurStack.addSpacer(8);

    const eurRateText = eurStack.addText(`${format(ECU)} CUP`);
    eurRateText.textColor = Color.white();
    eurRateText.font = Font.boldMonospacedSystemFont(22);

    eurStack.addSpacer();

    // usd
    const usdStack = mainStack.addStack();
    usdStack.layoutHorizontally();
    usdStack.centerAlignContent();
    usdStack.borderColor = Color.red();
    //usdStack.borderWidth = 1;
    usdStack.spacing = 8;

    usdStack.addSpacer();

    const usdText = usdStack.addText('USD');
    usdText.textColor = Color.white();
    usdText.font = Font.boldMonospacedSystemFont(22);

    const usdImage = usdStack.addImage(getImage('usd'));
    usdImage.imageSize = new Size(36, 36);

    const usdRateText = usdStack.addText(`${format(USD)} CUP`);
    usdRateText.textColor = Color.white();
    usdRateText.font = Font.boldMonospacedSystemFont(22);

    usdStack.addSpacer();

    // mlc
    const mlcStack = mainStack.addStack();
    mlcStack.layoutHorizontally();
    mlcStack.centerAlignContent();
    mlcStack.borderColor = Color.red();
    //mlcStack.borderWidth = 1;
    mlcStack.spacing = 8;

    mlcStack.addSpacer();

    const mlcText = mlcStack.addText('MLC');
    mlcText.textColor = Color.white();
    mlcText.font = Font.boldMonospacedSystemFont(22);

    const mlcImage = mlcStack.addImage(getImage('mlc'));
    mlcImage.imageSize = new Size(36, 36);

    const mlcRateText = mlcStack.addText(`${format(MLC)} CUP`);
    mlcRateText.textColor = Color.white();
    mlcRateText.font = Font.boldMonospacedSystemFont(22);

    mlcStack.addSpacer();

    // footer
    w.addSpacer(2);

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

// Assemble small widget layout
function createSmallWidget(data, widgetUrl) {
    const { USD, ECU, MLC } = data;

    const w = new ListWidget();
    w.backgroundColor = new Color('#FFCC00');
    w.setPadding(8, 16, 8, 16);
    w.url = widgetUrl;

    // header
    w.addSpacer(2);

    const staticText = w.addText('Currency');
    staticText.textColor = new Color('#003399');
    staticText.font = Font.boldSystemFont(12);
    staticText.leftAlignText();

    const exchangeText = w.addText('Exchange');
    exchangeText.textColor = new Color('#003399');
    exchangeText.font = Font.boldSystemFont(16);
    exchangeText.leftAlignText();

    w.addSpacer(4);

    // body
    const mainStack = w.addStack();
    mainStack.layoutVertically();
    mainStack.centerAlignContent();
    mainStack.borderColor = Color.black();
    //mainStack.borderWidth = 1;

    // eur
    const eurStack = mainStack.addStack();
    eurStack.layoutHorizontally();
    eurStack.centerAlignContent();
    eurStack.borderColor = Color.red();
    //eurStack.borderWidth = 1;
    eurStack.spacing = 2;

    const eurImage = eurStack.addImage(getImage('eur'));
    eurImage.imageSize = new Size(33, 33);

    const eurRateText = eurStack.addText(`${format(ECU, 0)} CUP`);
    eurRateText.textColor = Color.white();
    eurRateText.font = Font.boldMonospacedSystemFont(18);

    eurStack.addSpacer();

    // usd
    const usdStack = mainStack.addStack();
    usdStack.layoutHorizontally();
    usdStack.centerAlignContent();
    usdStack.borderColor = Color.red();
    //usdStack.borderWidth = 1;
    usdStack.spacing = 2;

    const usdImage = usdStack.addImage(getImage('usd'));
    usdImage.imageSize = new Size(33, 33);

    const usdRateText = usdStack.addText(`${format(USD, 0)} CUP`);
    usdRateText.textColor = Color.white();
    usdRateText.font = Font.boldMonospacedSystemFont(18);

    usdStack.addSpacer();

    // mlc
    const mlcStack = mainStack.addStack();
    mlcStack.layoutHorizontally();
    mlcStack.centerAlignContent();
    mlcStack.borderColor = Color.red();
    //mlcStack.borderWidth = 1;
    mlcStack.spacing = 2;

    const mlcImage = mlcStack.addImage(getImage('mlc'));
    mlcImage.imageSize = new Size(33, 33);

    const mlcRateText = mlcStack.addText(`${format(MLC, 0)} CUP`);
    mlcRateText.textColor = Color.white();
    mlcRateText.font = Font.boldMonospacedSystemFont(18);

    mlcStack.addSpacer();

    const date = new Date();
    const df = new DateFormatter();
    df.useShortDateStyle();

    const hf = new DateFormatter();
    hf.useShortTimeStyle();

    const dateText = w.addText(`${df.string(date)} ${hf.string(date)}`);
    dateText.textColor = new Color('#003399');
    dateText.font = Font.semiboldSystemFont(8);
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

function format(v, fractionDigits = 2) {
    return Math.round(Number.parseFloat(v)).toFixed(fractionDigits);
}

