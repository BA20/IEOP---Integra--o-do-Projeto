const dotenv = require("dotenv");
const express = require("express");
const request = require("request");
const app = express();

const resultenv = dotenv.config();

const user = process.env.USER;
const subscription = process.env.SUBSCRIPTION;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 3000;

app.post("/getEncomenda", function(req,res){
 const idencomenda = req.body.Produtos;
 request(
  {
    url: "https://identity.primaverabss.com/core/connect/token",
    method: "POST",
    auth: {
      user: "IE-PROJETO-GRUPO4",
      pass: "95e020d8-40fe-4118-a704-b765af6cff75",
    },
    form: {
      grant_type: "client_credentials",
      scope: "application",
    },
  },
  function (err, response) {
    if (response) {
      let json = JSON.parse(response.body);
      let access_token = json.access_token;
      let url =
        "http://my.jasminsoftware.com/api/" +
        user +
        "/" +
        subscription +
        "/materialsCore/materialsItems/";

      request(
        {
          url: url,
          method: "GET",
          headers: {
            Authorization: `bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          form: {
            scope: "application",
          },
        },
        function (err, response) {
          if (err) {
            response.status(200).json({
              status: false,
              message: "Problemas!",
            });
            return;
          }

          let json = JSON.parse(response.body);

          //ver o output do pedido
          console.log(json);
        }
      );
    } else {
      res.status(200).json({
        status: false,
        message: "Ocorreu um erro ao fazer o pedido de autenticação",
      });
    }
  }
);

})



//Indicar que a api está a funcionar
app.get("/", function (req, res) {
  res.status(200).json({
    status: true,
    message: "Sucess",
  });
});

app.get("/chave", function (req, res) {
  request(
    {
      url: "https://identity.primaverabss.com/core/connect/token",
      method: "POST",
      auth: {
        user: "IE-PROJETO-GRUPO4",
        pass: "95e020d8-40fe-4118-a704-b765af6cff75",
      },
      form: {
        grant_type: "client_credentials",
        scope: "application",
      },
    },
    function (err, response) {
      if (response) {
        let json = JSON.parse(response.body);
        res.status(200).json({
          status: true,
          message: json.access_token,
        });
        console.log("Access Token:" + "\n", json.access_token);
      } else {
        console.log("Could not obtain access token.");
      }
    }
  );
});

//pedido para ver items (GET)
app.get("/items", function (req, res) {
  request(
    {
      url: "https://identity.primaverabss.com/core/connect/token",
      method: "POST",
      auth: {
        user: "IE-PROJETO-GRUPO4",
        pass: "95e020d8-40fe-4118-a704-b765af6cff75",
      },
      form: {
        grant_type: "client_credentials",
        scope: "application",
      },
    },
    function (err, response) {
      if (response) {
        let json = JSON.parse(response.body);
        let access_token = json.access_token;
        let url =
          "http://my.jasminsoftware.com/api/" +
          user +
          "/" +
          subscription +
          "/materialsCore/materialsItems/";

        request(
          {
            url: url,
            method: "GET",
            headers: {
              Authorization: `bearer ${access_token}`,
              "Content-Type": "application/json",
            },
            form: {
              scope: "application",
            },
          },
          function (err, response) {
            if (err) {
              response.status(200).json({
                status: false,
                message: "Problemas!",
              });
              return;
            }

            let json = JSON.parse(response.body);

            //ver o output do pedido
            console.log(json);
            res.send(json)
          }
        );
      } else {
        res.status(200).json({
          status: false,
          message: "Ocorreu um erro ao fazer o pedido de autenticação",
        });
      }
    }
  );
});

/**
 * Method Type : POST
 * Endpoint : /verificarstock
 * PARAMS:
 *      nome ou id
 * Result:
 *      status - booleano que indica se foi feito o pedido com sucesso
 *      message - string que contêm o nome ou o erro
 */

app.post("/verificarstock", function (req, resposta) {
  
  //let itemKey = req.params.itemKey;
  //let quantidade = req.params.quantidade;
  //Pedir um acces token
  request(
    {
      url: "https://identity.primaverabss.com/core/connect/token",
      method: "POST",
      auth: {
        user: "IE-PROJETO-GRUPO4",
        pass: "95e020d8-40fe-4118-a704-b765af6cff75",
      },
      form: {
        grant_type: "client_credentials",
        scope: "application",
      },
    },
    function (err, res) {
      if (res) {
        let json = JSON.parse(res.body);
        let access_token = json.access_token;

        let quantidade = req.body.Produto.quantidade;
        
        qtd = quantidade;
        id = req.body.Produto.itemkey;

        let url = `https://my.jasminsoftware.com/api/${user}/${subscription}/materialsCore/materialsItems/${req.body.Produto.itemkey}/`;

        console.log(url)

        request(
          {
            url: url,
            method: "GET",
            headers: {
              Authorization: `bearer ${access_token}`,
              "Content-Type": "application/json",
            },
            form: {
              scope: "application",
            },
          },

          function (err, res) {
            if (err) {
              resposta.status(200).json({
                status: false,
                message: "Tens de inserir um Itemkey",
              });
              return;
            }

            console.log(res.body);
            let json = JSON.parse(res.body);
            let preco = json.materialsItemWarehouses[0].calculatedUnitCost.amount
            if (json.materialsItemWarehouses[0].stockBalance > quantidade) {
              console.log("Sucesso");
              let total = (preco * quantidade)
              resposta.status(200).send({
                estado: true,
                totalvenda: total 
              });
            } else {
              resposta.status(200).json({
                estado: false,
                message: "Não existe esse item",
              });
            }
          }
        );
      } else {
        resposta.status(200).json({
          status: false,
          message: "Ocorreu um erro ao fazer o pedido de autenticação",
        });
      }
    }
  );
});

app.post("/CriarFatura", function (req, resposta) {
 
  
//  let itemKey = req.params.itemKey;
  //let quantidade = req.params.quantidade;
  //Pedir um acces token
  request(
    {
      url: "https://identity.primaverabss.com/core/connect/token",
      method: "POST",
      auth: {
        user: "IE-PROJETO-GRUPO4",
        pass: "95e020d8-40fe-4118-a704-b765af6cff75",
      },
      form: {
        grant_type: "client_credentials",
        scope: "application",
      },
    },
    function (err, res) {
      if (res) {
        let json = JSON.parse(res.body);
        let access_token = json.access_token;

        let quantidade = req.body.Produto.quantidade;
        console.log(req.body)

        let url = `https://my.jasminsoftware.com/api/${user}/${subscription}/materialsCore/materialsItems/${req.body.Produto.itemkey}/`;

        console.log(url)

        request(
          {
            url: url,
            method: "GET",
            headers: {
              Authorization: `bearer ${access_token}`,
              "Content-Type": "application/json",
            },
            form: {
              scope: "application",
            },
          },

          function (err, res) {
            if (err) {
              resposta.status(200).json({
                status: false,
                message: "Tens de inserir um Itemkey",
              });
              return;
            }

            console.log(res.body);
            let json = JSON.parse(res.body);
            if (json.materialsItemWarehouses[0].stockBalance > quantidade) {
              console.log("Sucesso");
              resposta.status(200).send({
                estado: true,
              });
            } else {
              resposta.status(200).json({
                estado: false,
                message: "Não existe esse item",
              });
            }
          }
        );
      } else {
        resposta.status(200).json({
          status: false,
          message: "Ocorreu um erro ao fazer o pedido de autenticação",
        });
      }
    }
  );
});

//Iniciar middleware
app.listen(PORT, function () {
  console.log("Middleware iniciado. A escutar o porto: " + PORT);
});

/*
let request = require('request');

request({
  url: 'https://identity.primaverabss.com/core/connect/token',
  method: 'POST',
  auth: {
    user: 'TESTE2344',
    pass: 'b23d3e6d-0ae6-41e0-bd63-5e0a99ae75cb'
  },
  form: {
    'grant_type': 'client_credentials',
    'scope': 'application',
  }
}, function(err, res) {
  if (res) {
    var json = JSON.parse(res.body);
    console.log("Access Token:", json.access_token);

  }
  else {
    console.log("Could not obtain acess token.");
  }
});
 */
