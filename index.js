const puppeteer = require('puppeteer');
const express = require('express');

const PORT = process.env.PORT || 5000;

app = express();
app.get('/placares', function (req, res) {

    let scrape = async () => {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        },
        /*{
            executablePath: 'C:/Users/Leandro/AppData/Local/Google/Chrome/Application'
        }*/
        );

        const page = await browser.newPage();
        await page.goto('https://play.livebet.com/#/results/?lang=pt-br', { waitUntil : ['load', 'domcontentloaded']});
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

                    if(partida.placarFinal != 'Void'){
                        data.push(partida);
                    }
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

app.get('/', function (req, res) {
    res.send({
        "name": "server-crawler",
        "version": "1.0.0",
        "developer": "Leandro Bruno Teixeira",
        "endpoint": {
            "GET": "/placares"
        }
    }
    );
});

app.get('/teste', function (req, res) {

    let scrape = async () => {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        },
        /*{
            executablePath: 'C:/Users/Leandro/AppData/Local/Google/Chrome/Application'
        }*/
        );

        const page = await browser.newPage();
        await page.goto('https://play.livebet.com/#/results/?lang=pt-br', { waitUntil : ['load', 'domcontentloaded']});
        await page.waitFor(10000);
 
        const selectorData = 'body > div.body-wrapper.lang-pt-br.results.theme-.livebet.playlivebetcom.classic.footer-movable > div.view-container.ng-scope.results > ng-include > div > div.center-container-p > div > div.navigation-of-results-j > div:nth-child(1) > ul > li:nth-child(3) > div > div > div';
        await page.waitForSelector(selectorData);
        await page.click(selectorData);
        await page.keyboard.press('ArrowLeft');
        await page.keyboard.press('Enter');
        await page.waitFor(5000);
        
        const selectorPesquisar = 'body > div.body-wrapper.lang-pt-br.results.theme-.livebet.playlivebetcom.classic.footer-movable > div.view-container.ng-scope.results > ng-include > div > div.center-container-p > div > div.navigation-of-results-j > div.results-table-cell-j.button-container-j > button';
        await page.waitForSelector(selectorPesquisar);
        await page.click(selectorPesquisar);
        await page.waitFor(10000);

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

                    if(partida.placarFinal != 'Void'){
                        data.push(partida);
                    }
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
