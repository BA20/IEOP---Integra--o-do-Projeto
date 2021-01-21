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
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IkFEM0Q1RDJERjM4OTZBMDUwMzYwNzVDQkNFNDc0RDJBMjI4MUVCM0UiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJyVDFkTGZPSmFnVURZSFhMemtkTktpS0I2ejQifQ.eyJuYmYiOjE2MTEyMzU2MjMsImV4cCI6MTYxMTI1MDAyMywiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS5wcmltYXZlcmFic3MuY29tIiwiYXVkIjpbImh0dHBzOi8vaWRlbnRpdHkucHJpbWF2ZXJhYnNzLmNvbS9yZXNvdXJjZXMiLCJqYXNtaW4iXSwiY2xpZW50X2lkIjoiSUUtUFJPSkVUTy1HUlVQTzQiLCJzY29wZSI6WyJhcHBsaWNhdGlvbiJdfQ.fA6q_a6Xm5oC27wg-PSHN5PfqQaXVboNnxFDwcO0m1YkoG3OXbsb91KcWT2qruUP28KHorNk-2cegm8KXM3UMSKrs-bWq8vLswzHVgAo8r_eMC4I69UNYwuh7-W84MumDyCHZfxOxfHI-O2AdBuKJPgZcH6s9U9LDFk77kEQ9r8u5eJMYwuKGC1Z1BSalzUGO6b2YPFjlI_qVbsREhzxyURvOe1ZixGnzqLlYFhjSOuFX1ff9tMJWyNTnMAkHH9ojyFKkYZxBA7IhfPZmdsg7kc42gxLENndft3w059RUW3dj_oKNdF_oEnsmyw5W9ow3p32MvDE5377EQBbdc0fNQ";
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

  var produtos = []


    PedidoJasmine(AuthStr, req).then((kikw) => {
      for (var i = 0; i < tamanho; i++) {
        var preco = kikw[i]
        produtos.push({
          salesItem:req.body.Produto[i].itemkey,
          quantity:req.body.Produto[i].quantidade,
          unitPrice:{
            amount: preco
          }
        })
      }

      var dados = {
        emailTo:req.body.email,
        buyerCustomerParty: "INDIF",
        documentLines: 
          produtos,
      };
      
      console.log("DADOSSSSSSSSSSSSSSSSSSSSSSSSSS",dados)
    var jasminLink =
      "https://my.jasminsoftware.com/api/247212/247212-0001/billing/invoices";
  
    axios
      .post(jasminLink, dados, { headers: { Authorization: AuthStr } })
      .then((response) => {
        res.status(200).send({
          done: true,
        });
        console.log("GG FEITO");
      })
      .catch((error) => {
        console.log("AZEDOU MARMITA");
        console.log(error);
      });
  
  
    });


 


    async function PedidoJasmine(AuthStr, req) {
      return await new Promise((resolve, reject) => {
        console.log(req.body);
      
        var tamanho = Object.keys(req.body.Produto).length;
  
        var array = [];
  
        for (var i = 0; i < tamanho; i++) {
          var promise = new Promise((resolve, reject) => {
            let url = `https://my.jasminsoftware.com/api/247212/247212-0001/salesCore/salesItems/${req.body.Produto[i].itemkey}/`;
            console.log(url);
  
            request(
              {
                url: url,
                method: "GET",
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
                  reject("gg3");
                }
                let json = JSON.parse(res.body);
                let preco = json.priceListLines[0].priceAmount.amount;
                resolve(preco);
              }
            );
          });
          array.push(promise);
        }
        var total = [];
        Promise.all(array).then((value) => {
          console.log("VALUE:", value);
          value.forEach((valor) => {
            total.push(valor)
          });
          resolve(total);
        });
      });
    }
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
                reject("gg1");
              }

              let json = JSON.parse(res.body);
              let preco =
                json.materialsItemWarehouses[0].calculatedUnitCost.amount;

              if (json.materialsItemWarehouses[0].stockBalance > quantidad) {
                subtotal = parseFloat(preco) * parseInt(quantidad);
                console.log(subtotal);
                resolve(subtotal);
              } else {
                reject("gg2");
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
        total = parseFloat(total * 1.23)
        resolve(total);
      });
    });
  }
});


//Iniciar middleware
app.listen(PORT, function () {
  console.log("Middleware iniciado. A escutar o porto: " + PORT);
});

