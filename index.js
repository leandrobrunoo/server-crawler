const puppeteer = require('puppeteer');
const express = require('express');

var request = require('request');
var moment = require('moment');

const PORT = process.env.PORT || 5000;

app = express();

app.get('/', function (req, res) {
    res.send({
        "name": "server-crawler",
        "version": "1.3.1",
        "developer": "Leandro Bruno Teixeira",
        "endpoint": ["show10bet", "stsbet", "livescore"]
    }
    );
});

app.get('/show10bet', function (req, res) {
    
    let data = moment(new Date()).format('YYYY-MM-DD');
    // console.log(data);
  
    var urlTest = 'https://demo.cnf.bet/api/campeonatos?filter%5B%40jogo%5D%5Bhorario%5D%5B%24between%5D%5B%5D='+data+'T03%3A00%3A00.000Z&filter%5B%40jogo%5D%5Bhorario%5D%5B%24between%5D%5B%5D='+moment(new Date()).add(1, 'days').format('YYYY-MM-DD')+'T02%3A59%3A59.999Z&filter%5B%40jogo%5D%5B%24or%5D%5B0%5D%5BtimeAResultado%5D%5B%24not%5D=null&filter%5B%40jogo%5D%5B%24or%5D%5B0%5D%5BtimeBResultado%5D%5B%24not%5D=null&filter%5B%40jogo%5D%5B%24or%5D%5B1%5D%5BresultadoOpcoes%5D%5B%24not%5D=null&filter%5B%40jogo%5D%5Bativo%5D=1&filter%5Bativo%5D=1&include=jogos.cotacoes.apostaTipo&sort=nome';
  
     request(urlTest, function (error, response, body) {
       //verificar se o gravatar existe - se ele não existe vai retornar 404 devido ao parametro passado ao api
       if (!error && response.statusCode == 200) {
         //  console.log('status é ok, achou');
         
         let jogosResponse = JSON.parse(body).jogos;
         let data = [];
         
         if(jogosResponse != undefined) {
           
          for (var jogo of jogosResponse) {
            let partida = {};
            
            partida.campeonato = '';
            partida.timeCasa = jogo.timeANome;
            partida.timeFora = jogo.timeBNome;
            
            partida.data = moment(new Date(jogo.horario)).format('M/D/YYYY HH:mm');
            
            partida.primeiroTempo = jogo.timeAResultado1Tempo +'-'+ jogo.timeBResultado1Tempo;
            partida.segundoTempo = jogo.info.timeAResultado +'-'+ jogo.info.timeBResultado;
            partida.placarFinal = jogo.timeAResultado +'-'+ jogo.timeBResultado;
            
            data.push(partida);
          };
        }
        
        res.send(data);
        
      } else if (!error && response.statusCode == 404) {
        //  console.log('deu 404');
        res.send('<h1>Não achou nada. :(</h1> <p>Impresso na tela '+response.statusCode+'</p>');
      }
    });

});

app.get('/livescore', function (req, res) {
    
  let scrape = async () => {
      const browser = await puppeteer.launch({
          headless: true,
          args: [
              '--no-sandbox',
              '--disable-setuid-sandbox'
          ]
      }
      );
      
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      
      await page.goto('https://www.livescore.in/br/', 
      { waitUntil : ['load', 'domcontentloaded']});
      
      await page.waitFor(2000);
      console.log('Site carregado!');
      
      const selector = '#live-table > div.tabs > div.tabs__group > div:nth-child(5)';
      await page.waitForSelector(selector);
      
      console.log('click no encerrados');
      await page.click(selector);
      await page.waitFor(1000);
    
    //  console.log('click voltar uma data');
    //  await page.click('#live-table > div.tabs > div.calendar > div:nth-child(1) > div');
    //  await page.waitFor(5000);

      const selectorUtc = '#live-table > div.event > div > div';
      await page.waitForSelector(selectorUtc);
      
      const selectOptions = await page.$$eval('.event__match', options => {
        return options.map(option => option.innerText ) 
      });

    //  console.log(selectOptions);
      
      let placares = [];
      for (var element of selectOptions) {
        
          if( element.split('\n')[0] === "Encerrado") {
          //  console.log(element);
            let partida = {};
            partida.campeonato = '';
        //    partida.data = new Date().toLocaleDateString().concat(" " + element.innerText.split('\t')[0].replace(/(\r\n|\n|\r)/gm, ''));
            partida.timeCasa = element.split('\n')[1];
            partida.timeFora = element.split('\n')[5];
            partida.primeiroTempo = element.split('\n')[6];
            partida.segundoTempo = '';
            partida.placarFinal = element.split('\n')[2] +'-'+ element.split('\n')[4];
            
            if(partida.primeiroTempo !== undefined){
              partida.primeiroTempo = partida.primeiroTempo.replace('(', '');
              partida.primeiroTempo = partida.primeiroTempo.replace(')', '');
              partida.primeiroTempo = partida.primeiroTempo.split('-')[0].replace(' ','').trim() +"-"+partida.primeiroTempo.split('-')[1].replace(' ','').trim();

            //  console.log(partida.primeiroTempo.split('-')[0].replace(' ','').trim() +"-"+partida.primeiroTempo.split('-')[1].replace(' ','').trim());

              placares.push(partida);

              //  console.log(partida.primeiroTempo);
            }

        }
      }

      browser.close();
      return placares;

      /**
      const result = await page.evaluate(() => {
          
          let data = [];
      
        //  let elements = [...document.querySelectorAll('#live-table > div.event > div > div')];  
    //    const names = document.querySelectorAll('.event__match');  
    //    const namesArray = Array.from(names);
    //    console.log('namesArray');
           for (var element of elements) {
               if( element.innerText.split('\t')[1].replace(/(\r\n|\n|\r)/gm, '') == "Encerrado"){
                   let partida = {};
                   partida.data = new Date().toLocaleDateString().concat(" " + element.innerText.split('\t')[0].replace(/(\r\n|\n|\r)/gm, ''));
                   partida.timeCasa = element.innerText.split('\t')[2].replace(/(\r\n|\n|\r)/gm, '');
                   partida.placarFinal = element.innerText.split('\t')[3].replace(/(\r\n|\n|\r)/gm, '').replace(/\s{1,}/g, '');
                   partida.timeFora = element.innerText.split('\t')[4].replace(/(\r\n|\n|\r)/gm, '');
                   partida.primeiroTempo = element.innerText.split('\t')[5].replace(/(\r\n|\n|\r)/gm, '').replace(/\s{1,}/g, '');
                 //   partida.status = element.innerText.split('\t')[1].replace(/(\r\n|\n|\r)/gm, '');
                 
                 partida.primeiroTempo = partida.primeiroTempo.replace('(', '');
                 partida.primeiroTempo = partida.primeiroTempo.replace(')', '');
                 
                 partida.campeonato = '';
                 partida.segundoTempo = '';
                 
                 data.push(partida);
             }
             
            }
            
            return data;
        });
          */
      
    //  browser.close();
    //  return result;
  };
  
  scrape().then((value) => {
      //    console.log(value);
      // console.log("7) "+  new Date().toString());
      
      // console.log("1) "+  new Date().toDateString());
      // console.log("2) "+  new Date().toISOString());
      // console.log("3) "+  new Date().toJSON());
      // console.log("4) "+  new Date().toLocaleDateString());
      // console.log("5) "+  new Date().toLocaleString());
      // console.log("6) "+  new Date().toLocaleTimeString());
      // console.log("7) "+  new Date().toString());
      // console.log("8) "+  new Date().toISOString().slice(0,10));
      
      res.send(value);
  }).catch(e => {
      res.send(e);
  });
});

app.get('/stsbet', function (req, res) {
    
  /**
   
    let scrape = async () => {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        },
        //{
        //    executablePath: 'C:/Users/Leandro/AppData/Local/Google/Chrome/Application'
       // }
        );
        
        const page = await browser.newPage();
        //    await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
        
        await page.goto('https://www.stsbet.co.uk/in-play#/results', 
        { waitUntil : ['load', 'domcontentloaded']});
        await page.waitFor(20000);

        console.log('Pagina carregada.');
 
        const result = await page.evaluate(() => {

            let data = [];
            let elements = [...document.querySelectorAll('#ember7 > div.results-events > div.results-events-body > div.results-events-body-inner > div.ember-view > div.results-events-match')]; // > div.ember-view > div.results-events-match
            // elements.shift();

            for (var element of elements) {
               // let partida = {};
               // partida.data = element.innerText;
               // data.push(partida);
               
               //    if (element.innerText != 'No information available' && element.innerText != 'Void') {
                   
                   if(element.innerText.split('\n')[3] != 'Void' && 
                   element.innerText.split('\n')[3].split(' ').length == 2 &&
                   element.innerText.split('\n')[1] != 'Fouls and shots on Goal' &&
                   element.innerText.split('\n')[1] != 'Cards and Corners'){
             
             let partida = {};
                partida.data = element.innerText.split('\n')[0];
                partida.campeonato = element.innerText.split('\n')[1];

                partida.timeCasa = element.innerText.split('\n')[2].split(' - ')[0];
                partida.timeFora = element.innerText.split('\n')[2].split(' - ')[1];
                
                partida.primeiroTempo = element.innerText.split('\n')[3].split(' ')[1];
                partida.primeiroTempo = partida.primeiroTempo.replace('(','');
                partida.primeiroTempo = partida.primeiroTempo.replace(')','');
                partida.primeiroTempo = partida.primeiroTempo.replace(':','-');
                
                partida.segundoTempo = "";

                partida.placarFinal = element.innerText.split('\n')[3].split(' ')[0];
                partida.placarFinal = partida.placarFinal.replace(':','-');
                    
                    data.push(partida);
                }                 
                    //    if(partida.placarFinal != 'Void'){
                        //    let p = {};
                        //    p.html = element.innerText;
                        //    data.push(p);
                  //  }
                }
            
          //  }

            console.log('sair for');
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

    */
    
    res.send('[{}]');
});

// Execução do serviço
app.listen(PORT);
console.log(`Listening on ${PORT}`);
exports = module.exports = app;
