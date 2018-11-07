const puppeteer = require('puppeteer');
const express = require('express');

const PORT = process.env.PORT || 5000;

app = express();

var utc = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000);

app.get('/', function (req, res) {
    res.send({
        "name": "server-crawler",
        "version": "1.0.0",
        "developer": "Leandro Bruno Teixeira",
        "endpoint": {
            "GET": "/placares"
        },
        "Data": utc
    }
    );
});

app.get('/placares', function (req, res) {

        let scrape = async () => {
            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ]
            });

            const page = await browser.newPage();
            await page.goto('https://play.livebet.com/#/results/?lang=pt-br');
            await page.waitFor(15000);

            const result = await page.evaluate(() => {

                let data = [];
                let elements = [...document.querySelectorAll('body > div.body-wrapper.lang-pt-br.results.theme-.livebet.playlivebetcom.classic.footer-movable > div.view-container.ng-scope.results > ng-include > div > div.center-container-p > div > div.results-table-j > table > tbody > tr')]; // Select all Products
                elements.shift();

                for (var element of elements) {
                    if (element.innerText != 'No information available' && element.innerText != 'Void') {
                        let partida = {};
                        partida.data = element.innerText.split('\n')[0];
                        partida.campeonato = element.innerText.split('\n')[1];
                        partida.timeCasa = element.innerText.split('\n')[2].split(' - ')[0];
                        partida.timeFora = element.innerText.split('\n')[2].split(' - ')[1];
                        partida.primeiroTempo = element.innerText.split('\n')[3].split(' ')[1];
                        partida.placarFinal = element.innerText.split('\n')[3].split(' ')[0];
                        partida.dados = element.innerText;
                        data.push(partida);
                    }
                }
                return data;
            });
            browser.close();
            return result;
        };

        scrape().then((value) => {
            // console.log(value);
            res.send(value);
        }).catch(e => {
            res.send(e);
        });

});

app.get('/raspagem', function (req, res) {

    let scrape = async () => {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });

        const page = await browser.newPage();
        await page.goto('https://play.livebet.com/#/results/?lang=pt-br');
        await page.waitFor(15000);

        const result = await page.evaluate(() => {

            let data = [];
            let elements = [...document.querySelectorAll('body > div.body-wrapper.lang-pt-br.results.theme-.livebet.playlivebetcom.classic.footer-movable > div.view-container.ng-scope.results > ng-include > div > div.center-container-p > div > div.results-table-j > table > tbody > tr')]; // Select all Products
            elements.shift();

            for (var element of elements) {
                if (element.innerText != 'No information available' && element.innerText != 'Void') {
                    let partida = {};
                    partida.data = element.innerText.split('\n')[0];
                    partida.campeonato = element.innerText.split('\n')[1];
                    partida.timeCasa = element.innerText.split('\n')[2].split(' - ')[0];
                    partida.timeFora = element.innerText.split('\n')[2].split(' - ')[1];
                    partida.primeiroTempo = element.innerText.split('\n')[3].split(' ')[1];
                    partida.placarFinal = element.innerText.split('\n')[3].split(' ')[0];
                    data.push(partida);
                }
            }
            return data;
        });
        browser.close();
        return result;
    };

    scrape().then((value) => {
        // console.log(value);
        res.send(value);
    }).catch(e => {
        res.send(e);
    });

});

// Execução do serviço
app.listen(PORT);
console.log(`Listening on ${PORT}`);
exports = module.exports = app;
