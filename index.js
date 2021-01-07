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
        pass: "24f9ddd6-ece3-4d9e-ba63-2ec1977bca01",
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
        pass: "24f9ddd6-ece3-4d9e-ba63-2ec1977bca01",
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
  /*if (typeof request.query.itemKey === "undefined") {
        resposta.status(200).json({
            status: false,
            message: "Não existe este item!"
        });
        return;
    }*/

  let itemkey = req.params.itemKey;
  //Pedir um acces token
  request(
    {
      url: "https://identity.primaverabss.com/core/connect/token",
      method: "POST",
      auth: {
        user: "IE-PROJETO-GRUPO4",
        pass: "24f9ddd6-ece3-4d9e-ba63-2ec1977bca01",
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

        let qtd = req.body.quantidade;
        console.log(qtd);
        let url = `https://my.jasminsoftware.com/api/${user}/${subscription}/materialsCore/materialsItems/${req.query.itemKey}/`;

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

            if (json.materialsItemWarehouses[0].stockBalance > -1) {
              console.log("Sucesso");
              resposta.status(200).send({
                message: true,
              });
            } else {
              resposta.status(200).json({
                status: false,
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

//POST CUSTOMER M
/**
 *  Method: POST
 *  endpoint: /createcliente
 *  PARAMS:
 *      Nome Próprio
 *      endereço
 *      E-mail
 *      Telefone
 *      nif
 *
 *  retorno:
 *      status,
 *      message: id
 */

app.post("/createcliente", function (request, resposta) {
  if (typeof request.body.nome === "undefined") {
    resposta.status(200).json({
      status: false,
      message: "é necessário porporcionar um nome",
    });
    return;
  }

  if (typeof request.body.data === "undefined") {
    resposta.status(200).json({
      status: false,
      message: "É necessário porporcionar uma data",
    });
    return;
  }

  if (typeof request.body.email === "undefined") {
    resposta.status(200).json({
      status: false,
      message: "É necessário porporcionar um endereço de email",
    });
    return;
  }

  if (typeof request.body.telefone === "undefined") {
    resposta.status(200).json({
      status: false,
      message: "É necessário porporcionar um número telefónico",
    });
    return;
  }

  if (typeof request.body.nif === "undefined") {
    resposta.status(200).json({
      status: false,
      message: "É necessário porporcionar um nif",
    });
    return;
  }

  request(
    {
      url: "https://identity.primaverabss.com/core/connect/token",
      method: "POST",
      auth: {
        user: "IE-PROJETO-GRUPO4",
        pass: "24f9ddd6-ece3-4d9e-ba63-2ec1977bca01",
      },
      form: {
        grant_type: "client_credentials",
        scope: "application",
      },
    },
    function (err, res) {
      if (res) {
        //fazer o pedido de criaçao de cliente
        let baseUrlCriarCliente = `http://my.jasminsoftware.com/api/${user}/${subscription}`;
        let resourceCriarUtente = "/salesCore/customerParties";
        let json = JSON.parse(res.body);
        let access_token = json.access_token;
        console.log(access_token);
        let urlPedido = `${baseUrlCriarCliente + resourceCriarUtente}`;

        request(
          {
            url: urlPedido,
            method: "POST",
            headers: {
              Authorization: `bearer ${access_token}`,
              "Content-Type": "application/json",
            },
            form: {
              scope: "application",
            },
            data: {
              name: request.body.nome,
              isExternallyManaged: false,
              currency: "EUR",
              isPerson: true,
              country: "PT",
            },
          },
          function (err) {
            if (err) {
              resposta.status(200).json({
                status: false,
                message: "Ocorreu um erro ao fazer o pedido de autenticação",
              });
            } else {
              resposta.status(200).json({
                status: true,
                message: "Cliente inserido",
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

//GET ESPECIALIDADE M
/**
 * METHOD: GET
 * ENDPOINT: /getespecialidades
 * Filtrar por grupo
 * retorna uma lista com as especialidades
 *
 */

app.get("/getespecialidades", function (request, resposta) {
  //Pedir um acces token
  request(
    {
      url: "https://identity.primaverabss.com/core/connect/token",
      method: "POST",
      auth: {
        user: "IE-PROJETO-GRUPO4",
        pass: "24f9ddd6-ece3-4d9e-ba63-2ec1977bca01",
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

        let url = `http://my.jasminsoftware.com/api/243221/243221-0001/salescore/salesitems/odata?$filter=Description eq 'Consulta'`;

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
                message: "Tenho problemas!",
              });
              return;
            }

            let json = JSON.parse(res.body);

            if (json.items.length > 0) {
              let Arr = [];
              json.items.forEach((item) =>
                Arr.push(item.complementaryDescription)
              );
              console.log("Sucesso");
              resposta.status(200).json({
                status: true,
                message: Arr,
              });
            } else {
              resposta.status(200).json({
                status: false,
                message: "Não existem especialidades!",
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

//POST ENCOMENDA
/**
 * METHOD: POST
 * ENDPOINT: /createencomenda
 *  PARAMS: idUtente, idEspecialidade/artigo
 *
 *  status: true
 *  status:
 *
 */
app.post("/createencomenda", function (request) {});

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
