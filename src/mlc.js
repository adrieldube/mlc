/* --------------------------------------------------------------
Description:
Scriptable iOS widget - Informal Currency Exchange in Cuba

Version:
1.0.0
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

async function init() {
    let widget;
    try {
        const data = await getData();
        const resources = await getImages();
        widget = createWidget(data, resources, widgetUrl);
    } catch (err) {
        console.error(`Error getting widget data. ${err}`);
        widget = createEmptyWidget();
    } finally {
        if (config.runsInWidget || config.runsInAccessoryWidget) {
            // create and show widget
            Script.setWidget(widget);
            Script.complete();
        }
        else {
            widget.presentMedium();
        }
    }
}

function createWidget(data, resources, widgetUrl) {
    if (config.runsInAccessoryWidget) {
        return createLockScreenWidget(data, widgetUrl);
    }
    else if (config.widgetFamily === 'small') {
        return createSmallWidget(data, resources, widgetUrl);
    }
    return createMediumWidget(data, resources, widgetUrl);
}

// assemble empty widget layout
function createEmptyWidget() {
    const w = new ListWidget();
    w.backgroundColor = new Color('#FFCC00');
    w.url = widgetUrl;

    w.addSpacer();

    const infoText = w.addText('No currency exchange data');
    infoText.textColor = Color.white();
    infoText.font = Font.boldMonospacedSystemFont(20);
    infoText.centerAlignText();

    const runsInSmallWidget = config.widgetFamily === 'small';

    if (runsInSmallWidget || config.runsInAccessoryWidget) {
        const fontSize = runsInSmallWidget ? 18 : 14;
        infoText.font = Font.boldMonospacedSystemFont(fontSize);
        infoText.leftAlignText();
    }

    w.addSpacer();

    return w;
}

// assemble medium widget layout
function createMediumWidget(data, resources, widgetUrl) {
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

    // eur
    const eurStack = mainStack.addStack();
    eurStack.layoutHorizontally();
    eurStack.centerAlignContent();

    eurStack.addSpacer();

    const eurText = eurStack.addText('EUR');
    eurText.textColor = Color.white();
    eurText.font = Font.boldMonospacedSystemFont(22);

    eurStack.addSpacer(10);

    const eurImage = eurStack.addImage(getImage(resources, 'eur'));
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
    usdStack.spacing = 8;

    usdStack.addSpacer();

    const usdText = usdStack.addText('USD');
    usdText.textColor = Color.white();
    usdText.font = Font.boldMonospacedSystemFont(22);

    const usdImage = usdStack.addImage(getImage(resources, 'usd'));
    usdImage.imageSize = new Size(36, 36);

    const usdRateText = usdStack.addText(`${format(USD)} CUP`);
    usdRateText.textColor = Color.white();
    usdRateText.font = Font.boldMonospacedSystemFont(22);

    usdStack.addSpacer();

    // mlc
    const mlcStack = mainStack.addStack();
    mlcStack.layoutHorizontally();
    mlcStack.centerAlignContent();
    mlcStack.spacing = 8;

    mlcStack.addSpacer();

    const mlcText = mlcStack.addText('MLC');
    mlcText.textColor = Color.white();
    mlcText.font = Font.boldMonospacedSystemFont(22);

    const mlcImage = mlcStack.addImage(getImage(resources, 'mlc'));
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

// assemble small widget layout
function createSmallWidget(data, resources, widgetUrl) {
    const { USD, ECU, MLC } = data;

    const w = new ListWidget();
    w.backgroundColor = new Color('#FFCC00');
    w.setPadding(8, 16, 8, 16);
    w.url = widgetUrl;

    // header
    w.addSpacer(8);

    const staticText = w.addText('Currency');
    staticText.textColor = new Color('#003399');
    staticText.font = Font.boldSystemFont(12);
    staticText.leftAlignText();

    const exchangeText = w.addText('Exchange');
    exchangeText.textColor = new Color('#003399');
    exchangeText.font = Font.boldSystemFont(16);
    exchangeText.leftAlignText();

    // body
    const mainStack = w.addStack();
    mainStack.layoutVertically();
    mainStack.centerAlignContent();

    // eur
    const eurStack = mainStack.addStack();
    eurStack.layoutHorizontally();
    eurStack.centerAlignContent();
    eurStack.spacing = 2;

    const eurImage = eurStack.addImage(getImage(resources, 'eur'));
    eurImage.imageSize = new Size(33, 33);

    const eurRateText = eurStack.addText(`${format(ECU, 0)} CUP`);
    eurRateText.textColor = Color.white();
    eurRateText.font = Font.boldMonospacedSystemFont(18);

    eurStack.addSpacer();

    // usd
    const usdStack = mainStack.addStack();
    usdStack.layoutHorizontally();
    usdStack.centerAlignContent();
    usdStack.spacing = 2;

    const usdImage = usdStack.addImage(getImage(resources, 'usd'));
    usdImage.imageSize = new Size(33, 33);

    const usdRateText = usdStack.addText(`${format(USD, 0)} CUP`);
    usdRateText.textColor = Color.white();
    usdRateText.font = Font.boldMonospacedSystemFont(18);

    usdStack.addSpacer();

    // mlc
    const mlcStack = mainStack.addStack();
    mlcStack.layoutHorizontally();
    mlcStack.centerAlignContent();
    mlcStack.spacing = 2;

    const mlcImage = mlcStack.addImage(getImage(resources, 'mlc'));
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

    w.addSpacer(8);

    return w;
}

// assemble lock screen widget layout
function createLockScreenWidget(data, widgetUrl) {
    const { USD, ECU, MLC } = data;

    const w = new ListWidget();
    w.url = widgetUrl;

    // eur
    const eurStack = w.addStack();
    eurStack.layoutHorizontally();
    eurStack.centerAlignContent();

    const eurText = eurStack.addText('EUR');
    eurText.textColor = Color.white();
    eurText.font = Font.boldSystemFont(14);

    eurStack.addSpacer();

    const eurRateText = eurStack.addText(`${format(ECU, 0)} CUP`);
    eurRateText.textColor = Color.white();
    eurRateText.font = Font.regularSystemFont(14);

    // usd
    const usdStack = w.addStack();
    usdStack.layoutHorizontally();
    usdStack.centerAlignContent();

    const usdText = usdStack.addText('USD');
    usdText.textColor = Color.white();
    usdText.font = Font.boldSystemFont(14);

    usdStack.addSpacer();

    const usdRateText = usdStack.addText(`${format(USD, 0)} CUP`);
    usdRateText.textColor = Color.white();
    usdRateText.font = Font.regularSystemFont(14);

    // mlc
    const mlcStack = w.addStack();
    mlcStack.layoutHorizontally();
    mlcStack.centerAlignContent();

    const mlcText = mlcStack.addText('MLC');
    mlcText.textColor = Color.white();
    mlcText.font = Font.boldSystemFont(14);

    mlcStack.addSpacer();

    const mlcRateText = mlcStack.addText(`${format(MLC, 0)} CUP`);
    mlcRateText.textColor = Color.white();
    mlcRateText.font = Font.regularSystemFont(14);

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

async function getData() {
    const rates = {};
    for (const currency of currencies) {
        const r = await getRate(currency);
        rates[currency] = r;
    }
    return rates;
}

async function getImages() {
    const result = {};
    for (const r of images) {
        const { name, url } = r;
        const req = new Request(url);
        const res = await req.loadImage();
        result[name] = res;
    }
    return result;
}

function getImage(resources, id) {
    return resources[id];
}

function format(value, fractionDigits = 2) {
    return Math.round(Number.parseFloat(value)).toFixed(fractionDigits);
}

//initialize
await init();

