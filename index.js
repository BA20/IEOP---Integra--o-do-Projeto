const dotenv = require("dotenv");
const express = require("express");
const request = require("request");
const app = express();
const axios = require("axios");

const resultenv = dotenv.config();

const user = process.env.USER;
const subscription = process.env.SUBSCRIPTION;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 3000;

app.post("/fatura", function (req, res) {

  console.log("ENTREI")
  console.log(req.body)
  const USER_TOKEN =
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IkFEM0Q1RDJERjM4OTZBMDUwMzYwNzVDQkNFNDc0RDJBMjI4MUVCM0UiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJyVDFkTGZPSmFnVURZSFhMemtkTktpS0I2ejQifQ.eyJuYmYiOjE2MTExNzcwOTUsImV4cCI6MTYxMTE5MTQ5NSwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS5wcmltYXZlcmFic3MuY29tIiwiYXVkIjpbImh0dHBzOi8vaWRlbnRpdHkucHJpbWF2ZXJhYnNzLmNvbS9yZXNvdXJjZXMiLCJqYXNtaW4iXSwiY2xpZW50X2lkIjoiSUUtUFJPSkVUTy1HUlVQTzQiLCJzY29wZSI6WyJhcHBsaWNhdGlvbiJdfQ.NqVroWW3fiPTp3YNnBME2LwdPo8x8bqFc7N63EuDAzjm7wxomKqdb4M4CF1wOR7pndGHrmcHojG_hN4CTtGJsgSjrnbJu5amRu0ESNXInqtB4Qm6vH6ciUsq4bCGAXl9O1Oju6y_30yJAi83AZ861HMHUg0rJxXAPWizV24cG2jz8c38UROrJ8mvbHCc-16LM9fdihHE0F1bDaWrqQV0vcsQ7pFvnO-LeoAZfAcxlgra5g4MAf_M7e14969ATkFC3V7uQlrb8R2IJgDDXrKlYgzjuuI__-Bm0BPcrtckXeQNsc4zJjW89Qkzhi8ckHYc49Oac8yRM1uKJTQYVvpwwQ";
  /*request(
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
    function(err,response){
      if (response) {
        let json = JSON.parse(response.body);
        
      }
    }
  );*/
  const AuthStr = "Bearer ".concat(USER_TOKEN);

  var tamanho = Object.keys(req.body.Produto).length;

  var arrayItens = [];
  var arrayQuantidade = [];

  var produtos = []
  request(
    {
      url: "https://my.jasminsoftware.com/api/247212/247212-0001/salesCore/salesItems",
      method: "get",
      headers: {
        Authorization: AuthStr,
        "Content-Type": "application/json",
      },
      form: {
        scope: "application",
      },
    },
    (err, res) => {
      if (err) {
        reject("gg");
      }

      console.log("MASSAAAAAAAAAAAAAAAAAAAAAAAA",res.body)
      /*let json = JSON.parse(res.body);
      let preco =
        json.materialsItemWarehouses[0].calculatedUnitCost.amount;

      if (json.materialsItemWarehouses[0].stockBalance > quantidad) {
        subtotal = parseFloat(preco) * parseInt(quantidad);
        console.log(subtotal);
        resolve(subtotal);
      } else {
        reject("gg");
      }*/
    }
  );

  for (var i = 0; i < tamanho; i++) {
    arrayItens.push(req.body.Produto[i].itemkey);
    arrayQuantidade.push(req.body.Produto[i].quantidade);

  }

  var total = req.body.total;
  console.log(arrayItens, arrayQuantidade, total);

  /*var rodrigay = [
    {
      salesItem: "ARROZ",
      quantity: "2",
  
    },
    {
      salesItem: "MASSA",
      quantity: "3",

    },
  ]
  var dados = {
    buyerCustomerParty: req.body.cliente,
    documentLines: 
      rodrigay,
      

  };*/

  var jasminLink =
    "https://my.jasminsoftware.com/api/247212/247212-0001/billing/invoices";

  axios
    .post(jasminLink, dados, { headers: { Authorization: AuthStr } })
    .then((response) => {
      console.log("GG FEITO");
    })
    .catch((error) => {
      console.log("AZEDOU MARMITA");
      console.log(error);
    });
});

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
            res.send(json);
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
        PedidoJasmine(res, req).then((kikw) => {
          console.log(kikw);
          resposta.status(200).send({
            estado: true,
            totalvenda: kikw,
          });
        });
      }
    }
  );

  async function PedidoJasmine(res, req) {
    return await new Promise((resolve, reject) => {
      let json = JSON.parse(res.body);
      console.log(req.body);
      let access_token = json.access_token;

      var tamanho = Object.keys(req.body.Produto).length;

      var array = [];

      for (var i = 0; i < tamanho; i++) {
        var promise = new Promise((resolve, reject) => {
          var subtotal;
          var quantidad = req.body.Produto[i].quantidade;
          console.log(quantidad);
          let url = `https://my.jasminsoftware.com/api/${user}/${subscription}/materialsCore/materialsItems/${req.body.Produto[i].itemkey}/`;
          console.log(url);

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
            (err, res) => {
              if (err) {
                reject("gg");
              }

              let json = JSON.parse(res.body);
              let preco =
                json.materialsItemWarehouses[0].calculatedUnitCost.amount;

              if (json.materialsItemWarehouses[0].stockBalance > quantidad) {
                subtotal = parseFloat(preco) * parseInt(quantidad);
                console.log(subtotal);
                resolve(subtotal);
              } else {
                reject("gg");
              }
            }
          );
        });
        array.push(promise);
      }
      var total = 0;
      Promise.all(array).then((value) => {
        console.log("VALUE:", value);
        value.forEach((valor) => {
          total = parseFloat(total) + parseFloat(valor);
        });
        resolve(total);
      });
    });
  }
});


//Iniciar middleware
app.listen(PORT, function () {
  console.log("Middleware iniciado. A escutar o porto: " + PORT);
});

