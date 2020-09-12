const express = require('express'); // instancia o fram express para rotas
const app = express(); //salva ele em uma constate
const bodyParser = require("body-parser"); // instancia  body-parser para pode receber requisição
const connection = require("./database/database"); // cria coneção con DB via arquivo
const perguntaModel = require('./model/Pergunta'); // incorporando model de pergunta
const RespostaModel = require('./model/Resposta');
const Resposta = require('./model/Resposta');

connection.authenticate().then(()=>{
    console.log('Conectado com o DB com suceso');
})
.catch((msgerro)=>{
    console.log(msgerro)
}) // conecta com o banco 

app.set('view engine','ejs'); // usa a engine ejs para manipular HTML
app.use(express.static('public')); // usa arquivos staticos CSS JS e outros na pasta public
app.use(bodyParser.urlencoded({extended: false})); // usa o bodyparser para decodificar requisição
app.use(bodyParser.json()); //  ainda nao sei Rss

app.get("/",(req,res)=>{
    perguntaModel.findAll({raw:true,order:[
        ['id','DESC']
    ]}).then(perguntas =>{ // faz pesquisa no db e tras tudo cru com o raw e salva em perguntas
        res.render('index',{
            perguntas:perguntas //leva para o html o array de perguntas na variavel pergunta
        });
    });
    
}); // exemplo de rota padrao a index

app.get("/perguntar",(req,res)=>{
 res.render("perguntar");
});// exmplo de rota secundaria 

app.post("/salvar",(req,res)=>{
    var titulo = req.body.titulo;
    var desc = req.body.descricao;
    perguntaModel.create({ // salva enviando os dados para o db
        titulo:titulo, // captura os dados salvos nas variaveis  e envia para o campo da tabela
        descricao:desc
    }).then(()=>{ // se tudo deu certo ele passa o bloco
         res.redirect('/');  //redireciona para a root do site
    });
});// exemplo de rota recebendo dados 
app.post('/responder', (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    RespostaModel.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=>{
         res.redirect("/pergunta/"+perguntaId);
    });
});

app.get('/pergunta/:id', (req, res) => {
    var id = req.params.id;
    perguntaModel.findOne({
        where:{id: id}
    }).then(pergunta =>{
        if (pergunta != undefined) {
            RespostaModel.findAll({
                where:{perguntaId: pergunta.id}
            }).then(respostas =>{
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
          
        }else{
             res.redirect('/');
        }
    })
});




app.listen(4000,()=>{
console.log('Server ON')
}); // instancia o servidor na porta 4000 