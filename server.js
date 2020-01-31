const express = require('express');
const bodyParser = require('body-parser')
const http = require('http');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const squareConnect = require('square-connect');

const accessToken = 'EAAAEFLka9MssW_Ap9_sZlUAkLwYfLSnda6CJX9P5425guYJNtpjVG7NJjNQGwDk';

app.use(express.json());

app.use(function (req, res, next) {    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTION, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type,Authorization');   
    res.setHeader('Access-Control-Allow-Credentials','false');
    next();
});

// Set Square Connect credentials and environment
const defaultClient = squareConnect.ApiClient.instance;

// Configure OAuth2 access token for authorization: oauth2
const oauth2 = defaultClient.authentications['oauth2'];
oauth2.accessToken = accessToken;

// Set 'basePath' to switch between sandbox env and production env
// sandbox: https://connect.squareupsandbox.com
// production: https://connect.squareup.com
defaultClient.basePath = 'https://connect.squareupsandbox.com';

app.use(express.static(__dirname + '/dist/SquareAngular'));

app.get('/*', (req, res) => res.sendFile(path.join(__dirname + "/dist/SquareAngular/index.html")));

const server = http.createServer(app);

app.post('/process-payment', async (req, res) => {
    const request_params = req.body;
  
    // length of idempotency_key should be less than 45
    const idempotency_key = crypto.randomBytes(22).toString('hex');
  
    // Charge the customer's card
    const payments_api = new squareConnect.PaymentsApi();
    const request_body = {
      source_id: request_params.nonce,
      amount_money: {
        amount: 100, // $1.00 charge
        currency: 'USD'
      },
      idempotency_key: idempotency_key
    };
  
    try {
      const response = await payments_api.createPayment(request_body);
      res.status(200).json({
        'title': 'Payment Successful',
        'result': response
      });
    } catch(error) {
      res.status(500).json({
        'title': 'Payment Failure',
        'result': error.response.text
      });
    }
  });

server.listen(port, () => console.log('Running...'));