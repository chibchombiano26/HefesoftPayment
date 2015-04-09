var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var stripe = require('stripe')('sk_test_lf2op9O6fVZYvWs4v3rpjGQF');
var path = require('path');
var azure = require('azure-storage');
var tableSvc = azure.createTableService('hefesoft', 'dodn17DT7hBi3lXrWlvXihLS9J7xuItHLIpWLBZn2QEMdBHm02Lqxr055rNCpP5z3FhfcjjX3MhPy1Npk3VF3Q==');


var app = express();
app.use(bodyParser());



app.post('/charge', function (req, res) {
    tableServices('TpToken');    

    var stripeToken = req.body.stripeToken;
    var amount = 1000;

    stripe.charges.create({
        card: stripeToken,
        currency: 'usd',
        amount: amount
    },
    function(err, charge) {
        if (err) {
            res.send(500, err);
        } else {
            res.send(204);
            insert('TpToken', null);
        }
    });
});


function tableServices(nombre){    
    tableSvc.createTableIfNotExists(nombre, function (error, result, response) {
        if (!error) {
    // result contains true if created; false if already exists
        }
    });
}

function insert(table,entity){
    var entGen = azure.TableUtilities.entityGenerator;
    var task = {
        PartitionKey: entGen.String('hometasks'),
        RowKey: entGen.String('1'),
        description: entGen.String('take out the trash'),
        dueDate: entGen.DateTime(new Date(Date.UTC(2015, 6, 20))),
    };
    
    entity = task;

    tableSvc.insertEntity(table, entity, function (error, result, response) {
        if (!error) {
    // result contains the ETag for the new entity
        }
    });
}

var port = process.env.port || 1337;
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port);

