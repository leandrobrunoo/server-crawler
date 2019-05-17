const puppeteer = require('puppeteer');
const express = require('express');

const PORT = process.env.PORT || 5000;

app = express();
app.get('/placares-old', function (req, res) {

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
    //    await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
        await page.goto('https://play.livebet.com/#/results/?lang=pt-br', { waitUntil : ['load', 'domcontentloaded']});
        await page.waitFor(15000);
 
        const result = await page.evaluate(() => {

            let data = [];
            let elements = [...document.querySelectorAll('body > div.body-wrapper.lang-pt-br.results.theme-.livebet.playlivebetcom.classic.footer-movable > div.view-container.results > ng-include > div > div.center-container-p > div > div.results-table-j > table > tbody > tr')]; // Select all Products
            
            elements.shift();

            for (var element of elements) {
                if (element.innerText != 'No information available' && element.innerText != 'Void') {
                    let partida = {};
                    partida.data = element.innerText.split('\t')[0].replace(/(\r\n|\n|\r)/gm, '');
                    partida.campeonato = element.innerText.split('\t')[1].replace(/(\r\n|\n|\r)/gm, '');
                    partida.timeCasa = element.innerText.split('\t')[2].split(' - ')[0].replace(/(\r\n|\n|\r)/gm, '');
                    partida.timeFora = element.innerText.split('\t')[2].split(' - ')[1].replace(/(\r\n|\n|\r)/gm, '');
                    partida.primeiroTempo = element.innerText.replace(/(\r\n|\n|\r)/gm, '').split('\t')[3].split(' ')[1];
                    partida.placarFinal = element.innerText.split('\t')[3].split(' ')[0].replace(/(\r\n|\n|\r)/gm, '');

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
        "version": "1.3.0",
        "developer": "Leandro Bruno Teixeira",
        "endpoint": {
            "GET": "/placares"
        }
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
        },
        /*{
            executablePath: 'C:/Users/Leandro/AppData/Local/Google/Chrome/Application'
        }*/
        );

        const page = await browser.newPage();
        await page.goto('https://play.livebet.com/#/results/?lang=pt-br', { waitUntil : ['load', 'domcontentloaded']});
        await page.waitFor(12000);
        // console.log('Site carregado!');

        const selectorData = 'body > div.body-wrapper.lang-pt-br.results.theme-.livebet.playlivebetcom.classic.footer-movable > div.view-container.results > ng-include > div > div.center-container-p > div > div.navigation-of-results-j > div:nth-child(1) > ul > li:nth-child(3) > div > div > div > input';
        await page.waitForSelector(selectorData);
        // console.log('Agora vou clicar!');
        await page.click(selectorData);
        await page.keyboard.press('ArrowLeft');
        await page.keyboard.press('Enter');
        await page.waitFor(3000);

        // console.log('sport');
        const selectSport = 'body > div.body-wrapper.lang-pt-br.results.theme-.livebet.playlivebetcom.classic.footer-movable > div.view-container.results > ng-include > div > div.center-container-p > div > div.navigation-of-results-j > div:nth-child(1) > ul > li:nth-child(1) > label > div > select';
        await page.waitForSelector(selectSport);
        await page.click(selectSport);
        await page.keyboard.press('PageUp');
        await page.keyboard.press('PageUp');
        await page.keyboard.press('PageUp');
        await page.keyboard.press('Enter');
        await page.waitFor(1000);
        
        const selectorPesquisar = 'body > div.body-wrapper.lang-pt-br.results.theme-.livebet.playlivebetcom.classic.footer-movable > div.view-container.results > ng-include > div > div.center-container-p > div > div.navigation-of-results-j > div.results-table-cell-j.button-container-j > button';
        await page.waitForSelector(selectorPesquisar);
        // console.log('Agora vou clicar na pesquisa!');
        await page.click(selectorPesquisar);
        await page.waitFor(5000);

        const result = await page.evaluate(() => {

            let data = [];
            let elements = [...document.querySelectorAll('body > div.body-wrapper.lang-pt-br.results.theme-.livebet.playlivebetcom.classic.footer-movable > div.view-container.results > ng-include > div > div.center-container-p > div > div.results-table-j > table > tbody > tr')]; // Select all Products                            
            
            elements.shift();

            for (var element of elements) {
                if (element.innerText != 'No information available' && element.innerText != 'Void') {
                    let partida = {};
                    partida.data = element.innerText.split('\t')[0].replace(/(\r\n|\n|\r)/gm, '');
                    partida.campeonato = element.innerText.split('\t')[1].replace(/(\r\n|\n|\r)/gm, '');
                    partida.timeCasa = element.innerText.split('\t')[2].split(' - ')[0].replace(/(\r\n|\n|\r)/gm, '');
                    partida.timeFora = element.innerText.split('\t')[2].split(' - ')[1].replace(/(\r\n|\n|\r)/gm, '');
                    partida.primeiroTempo = element.innerText.replace(/(\r\n|\n|\r)/gm, '').split('\t')[3].split(' ')[1];
                    partida.placarFinal = element.innerText.split('\t')[3].split(' ')[0].replace(/(\r\n|\n|\r)/gm, '');

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
