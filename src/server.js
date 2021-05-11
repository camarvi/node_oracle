var express = require("express");

var app = express();

var bodyparser = require("body-parser");
var oracledb = require("oracledb");

app.use(bodyparser.urlencoded({
    extended: true
}));

/*
var connAttrs = {
    "user": "",
    "password": "",
    "connectString": ""
}
*/


var connAttrs = {
    "user": "System",
    "password": "Bactech",
    "connectString": "(DESCRIPTION =(LOAD_BALANCE = ON)(FAILOVER = ON)(ADDRESS =(PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=XE)(FAILOVER_MODE=(TYPE=SELECT)(METHOD = BASIC))))"
}




app.get('/', (req, res) => {
    res.send([{ message: 'hola mundo' }]);
});

app.get('/users', function(req, res) {
    "use strict";

    oracledb.getConnection(connAttrs, function(err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }
        connection.execute("SELECT * FROM all_users", {}, {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function(err, result) {
            if (err) {
                res.set('Content-Type', 'application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: "Error getting the dba_tablespaces",
                    detailed_message: err.message
                }));
            } else {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
                res.contentType('application/json').status(200);
                res.send(JSON.stringify(result.rows));

            }
            // Release the connection
            connection.release(
                function(err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("GET /sendTablespace : Connection released");
                    }
                });
        });
    });
});


/////Supprimer un Utilisateur (node.js)////// done
app.delete('/suppUser/:name', function(req, res, next) {

    var pname = req.params.name;
    oracledb.getConnection(connAttrs, function(err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }
        connection.execute("DROP USER " + pname, {}, {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function(err, result) {
            if (err) {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
                res.contentType('application/json').status(200);
                res.send(JSON.stringify(err.message));

            } else {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
                res.contentType('application/json').status(200);
                res.send(JSON.stringify("1"));

            }
            // Release the connection
            connection.release(
                function(err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("POST /sendTablespace : Connection released");
                    }
                });
        });
    });
});

/////Modifier un Utilisateur////// done
app.post('/updateUser', function(req, res, next) {

    var nomutilisateur = req.body.nomutilisateur;
    var motdepasse = req.body.motdepasse;
    var DefaultTBS = req.body.DefaultTBS;


    oracledb.getConnection(connAttrs, function(err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }
        //ALTER USER sidney 
        //IDENTIFIED BY second_2nd_pwd
        //DEFAULT TABLESPACE example;

        connection.execute("alter user " + nomutilisateur + " identified by " + motdepasse + "", {}, {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function(err, result) {
            if (err) {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
                res.contentType('application/json').status(200);
                res.send(JSON.stringify(err.message + " " + motdepasse));

            } else {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
                res.contentType('application/json').status(200);
                res.send(JSON.stringify("1"));

            }
            // Release the connection
            connection.release(
                function(err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("POST /sendTablespace : Connection released");
                    }
                });
        });
    });

});

/////Créer un Utilisateur////// done
app.post('/addUser', function(req, res, next) {

    var nom = req.body.nomutilisateur;
    var motdepasse = req.body.motdepasse;
    var confirmmotPasse = req.body.confirmPasswd;
    var statuss = req.body.statuss;
    var defaulttbs = req.body.defaulttbs;
    var Quota = req.body.Quota;
    var temptbs = req.body.temptbs;
    var requete = "";

    oracledb.getConnection(connAttrs, function(err, connection) {
        if (err) {
            // Error connecting to DB
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
            }));
            return;
        }
        if (confirmmotPasse == motdepasse)
            if (defaulttbs != "")
                requete = "create user " + nom + " identified by " + motdepasse + " DEFAULT TABLESPACE " + defaulttbs + "  ";
            else
                requete = "create user " + nom + " identified by " + motdepasse;

        if (statuss != "")
            requete += " ACCOUNT " + statuss;
        if (Quota != "")
            requete += " QUOTA " + Quota + " M ON " + defaulttbs;
        if (temptbs != "")
            requete += " TEMPORARY TABLESPACE " + temptbs;
        connection.execute(requete, {}, {
            outFormat: oracledb.OBJECT // Return the result as Object
        }, function(err, result) {
            if (err) {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
                res.contentType('application/json').status(200);
                res.send(JSON.stringify(err.message + " " + nom));

            } else {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
                res.contentType('application/json').status(200);
                res.send(JSON.stringify("1"));

            }
            // Release the connection
            connection.release(
                function(err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log("POST /sendTablespace : Connection released");
                    }
                });
        });
    });

});




app.listen(3000, 'localhost', function() {
    console.log("Servidor en puerto 3000");
})