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
const data = await getRates();

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
    w.backgroundColor = new Color('#5200ffe6');

    let staticText = w.addText('Mercado Informal de Divisas en Cuba');
    staticText.textColor = new Color('#444');
    staticText.font = Font.semiboldSystemFont(16);
    staticText.centerAlignText();

    w.addSpacer(2);

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

    w.setPadding(0, 0, 0, 0);
    w.url = widgetUrl;

    return w;
}

async function getRates() {
    const rates = {};
    for (const currency of currencies) {
        const r = await getRate(currency);
        rates[currency] = r;
    }
    return rates;
}

async function getRate(currency) {
    const url = `${apiUrl}&cur=${currency}`;
    const req = new Request(url);
    const res = await req.loadJSON();
    const { min, max, avg, median } = res[res.length - 1];
    console.log(`${currency} - Min: ${min}, Max: ${max}, Avg: ${avg}, Median: ${median}`);

    return avg;
}

function format(v) {
    return Math.round(Number.parseFloat(v)).toFixed(2);
}