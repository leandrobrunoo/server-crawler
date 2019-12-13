//====================
//  CHAMA OS MODULOS
//====================
var express = require('express');
var request = require('request'); // trata request

var moment = require('moment');

//===================
//     MIDDLEWARE
//===================
//levanta o server
const PORT = process.env.PORT || 5000;

app = express();

//===================
//  ROTAS DO EXPRESS
//===================

//rota de acerto - localhost:5000/acerto
app.get('/livescore', function(req, res) {

  let data = moment(new Date()).format('YYYY-MM-DD');
  // console.log(data);

  var urlTest = 'https://show10bet.cnf.bet/api/campeonatos?filter%5B%40jogo%5D%5Bhorario%5D%5B%24between%5D%5B%5D='+data+'T03%3A00%3A00.000Z&filter%5B%40jogo%5D%5Bhorario%5D%5B%24between%5D%5B%5D='+moment(new Date()).add(1, 'days').format('YYYY-MM-DD')+'T02%3A59%3A59.999Z&filter%5B%40jogo%5D%5B%24or%5D%5B0%5D%5BtimeAResultado%5D%5B%24not%5D=null&filter%5B%40jogo%5D%5B%24or%5D%5B0%5D%5BtimeBResultado%5D%5B%24not%5D=null&filter%5B%40jogo%5D%5B%24or%5D%5B1%5D%5BresultadoOpcoes%5D%5B%24not%5D=null&filter%5B%40jogo%5D%5Bativo%5D=1&filter%5Bativo%5D=1&include=jogos.cotacoes.apostaTipo&sort=nome';

  request(urlTest, function (error, response, body) {
    //verificar se o gravatar existe - se ele não existe vai retornar 404 devido ao parametro passado ao api
    if (!error && response.statusCode == 200) {
      console.log('status é ok, achou');
      
      let jogosResponse = JSON.parse(body).jogos;
      let data = [];

      if(jogosResponse != undefined) {

        for (var jogo of jogosResponse) {
          let partida = {};
          
          partida.campeonato = '';
          partida.timeCasa = jogo.timeANome;
          partida.timeFora = jogo.timeBNome;

          partida.data = moment(new Date(jogo.horario)).format('DD/MM/YYYY HH:mm');
          
          partida.primeiroTempo = jogo.timeAResultado1Tempo +'-'+ jogo.timeBResultado1Tempo;
          partida.segundoTempo = jogo.info.timeAResultado +'-'+ jogo.info.timeBResultado;
          partida.placarFinal = jogo.timeAResultado +'-'+ jogo.timeBResultado;
          
          data.push(partida);
        };
      }
        
      res.send(data);

    } else if (!error && response.statusCode == 404) {
      console.log('deu 404');
      res.send('<h1>Não achou nada. :(</h1> <p>Impresso na tela '+response.statusCode+'</p>');
    }
  });
});

//rota de erro - localhost:5000/erro
app.get('/erro', function(req, res) {
  var urlTest = 'http://bonsaiux.com.br/erro404';

  request(urlTest, function (error, response) {
    //verificar se o gravatar existe - se ele não existe vai retornar 404 devido ao parametro passado ao api
    if (!error && response.statusCode == 200) {
      console.log('status é ok, achou');
      res.send('<h1>Status é ok, achou</h1> <p>Impresso na tela '+response.statusCode+'</p>');
    } else if (!error && response.statusCode == 404) {
      console.log('deu 404');
      res.send('<h1>Não achou nada. :(</h1> <p>Impresso na tela '+response.statusCode+'</p>');
    }
  });
});

//Exibe a porta e avisos do app
app.listen(PORT);
console.log(`Listening on ${PORT}`);
exports = module.exports = app;


