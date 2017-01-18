import {setIssueRes, BAD_REQUEST, OK} from './utils';
let express = require('express');
let app = express();
let authUrl = '/api/auth';
let apiUrl = '/api';
app.post(authUrl+'/session', function (req, res) {
    let username = req.query.username;
    let password = req.query.password;

    console.log('Trying to log user: '+username);
    let mysql = require('mysql');
    let connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'mobile'
    });
    connection.connect();
    let query  = 'select * from users where username = "'+username+'" and password="'+password+'"';
    console.log(query);
    connection.query(query, function (err, row, fields) {
        console.log("Retrieving results...");
        if (!err){
            if(row.length == 1){
                let user = row[0];
                console.log("Login with success for user: "+JSON.stringify(user));
                res.json({userData: user});
            } else {
                setIssueRes(res, BAD_REQUEST, [{error: 'Wrong password'}]);
                console.log(res);
            }
        } else {
            console.log(err);
            setIssueRes(res, BAD_REQUEST, [{error: 'Wrong password'}])
        }
    });
});

app.get(apiUrl+'/shoplist', function (req, res) {
    let userId = req.query.id;
    let mysql = require('mysql');
    let connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'mobile'
    });
    connection.connect();
    let query  =
        "select liste_produse.id_produs as idLista, produse.denumire_produs as text from users "+
        "inner join user_liste on users._id = user_liste.id_user "+
        "inner join liste_produse on user_liste.id_lista = liste_produse.id "+
        "inner join produse on liste_produse.id_produs = produse.id "+
        'where users._id = ' + userId;
    connection.query(query, function (err, row, fields) {
        console.log("Retrieving results...");
        if (!err){
            let i;
            console.log(JSON.stringify(row));
            res.statusCode = OK;
            res.json({data:row});
        } else {
            console.log(err);
            setIssueRes(res, BAD_REQUEST, [{error: 'Wrong password'}])
        }
    });

});
app.post(apiUrl+'/item', function (req, res) {
    let userId = req.query.userId;
    let itemId;
    let itemText;
    if (req.query.itemId){
        itemId = req.query.itemId;
    }
    if (req.query.itemText){
        itemText = req.query.itemText;
    }
    let mysql = require('mysql');
    let connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'mobile'
    });
    connection.connect();
    if (itemId){
        let query = "update produse set produse.denumire_produs = '" + itemText +"' where produse.id = " + itemId;
        connection.query(query, function (err, result) {
            if (err){
                console.log(err);
                setIssueRes(res, BAD_REQUEST, [{error: err}]);
            } else {
                query  =
                    "select liste_produse.id_produs as idLista, produse.denumire_produs as text from users "+
                    "inner join user_liste on users._id = user_liste.id_user "+
                    "inner join liste_produse on user_liste.id_lista = liste_produse.id "+
                    "inner join produse on liste_produse.id_produs = produse.id "+
                    'where users._id = ' + userId + " and liste_produse.id_produs = " + itemId;
                connection.query(query, function (err, row, fields) {
                    console.log("Retrieving results...");
                    if (!err){
                        let i;
                        console.log(JSON.stringify(row));
                        res.statusCode = OK;
                        res.json({data:row});
                    } else {
                        console.log(err);
                        setIssueRes(res, BAD_REQUEST, [{error: 'Some error'}]);
                    }
                });
            }
        });
    } else {
        connection.beginTransaction(function (err) {
            if (err) {
                console.log(err);
                setIssueRes(res, BAD_REQUEST, [{error: err}]);
                return;
            }
            connection.query(
                "select user_liste.id_lista from user_liste " +
                "where user_liste.id_user = "+ userId, function (err, result) {
                    if (err) {
                        return connection.rollback(function () {
                            console.log(err);
                            setIssueRes(res, BAD_REQUEST, [{error: err}]);
                        });
                    }
                    let idLista = result[0].id_lista;
                    connection.query("insert into produse (denumire_produs) values ('"+ itemText +"');", function (err, result) {
                        if (err) {
                            return connection.rollback(function () {
                                console.log(err);
                                setIssueRes(res, BAD_REQUEST, [{error: err}]);
                            });
                        }
                        let lastId = result.insertId;
                        connection.query(" insert into liste_produse (id, id_produs) values ("+ idLista +", "+ lastId +");", function (err, result) {
                            if (err) {
                                return connection.rollback(function () {
                                    console.log(err);
                                    setIssueRes(res, BAD_REQUEST, [{error: err}]);
                                });
                            }
                            connection.commit(function (err) {
                                if (err){
                                    return connection.rollback(function () {
                                        console.log(err);
                                        setIssueRes(res, BAD_REQUEST, [{error: err}]);
                                    });
                                }
                                let query  =
                                    "select liste_produse.id_produs as idLista, produse.denumire_produs as text from users "+
                                    "inner join user_liste on users._id = user_liste.id_user "+
                                    "inner join liste_produse on user_liste.id_lista = liste_produse.id "+
                                    "inner join produse on liste_produse.id_produs = produse.id "+
                                    'where users._id = ' + userId + " and liste_produse.id_produs = " + lastId;
                                connection.query(query, function (err, row, fields) {
                                    console.log("Retrieving results...");
                                    if (!err){
                                        let i;
                                        console.log(JSON.stringify(row));
                                        res.statusCode = OK;
                                        res.json({data:row});
                                    } else {
                                        console.log(err);
                                        setIssueRes(res, BAD_REQUEST, [{error: 'Some error'}]);
                                    }
                                });
                            });
                        });
                    });
            });
        });
    }
});

app.post(apiUrl+'/deleteItem', function (req, res) {
    let userId = req.query.userId;
    let itemId;
    if (req.query.itemId){
        itemId = req.query.itemId;
    }
    let mysql = require('mysql');
    let connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'mobile'
    });
    connection.connect();
    if (itemId){
        let deletedProduct;
        let query  =
            "select liste_produse.id_produs as idLista, produse.denumire_produs as text from users "+
            "inner join user_liste on users._id = user_liste.id_user "+
            "inner join liste_produse on user_liste.id_lista = liste_produse.id "+
            "inner join produse on liste_produse.id_produs = produse.id "+
            'where users._id = ' + userId + " and liste_produse.id_produs = " + itemId;
        connection.query(query, function (err, row, fields) {
            console.log("Retrieving results...");
            if (!err){
                let i;
                console.log(JSON.stringify(row));
                deletedProduct = row;
            } else {
                console.log(err);
                setIssueRes(res, BAD_REQUEST, [{error: 'Some error'}]);
            }
        });
        connection.beginTransaction(function (err) {
            if (err) {
                console.log(err);
                setIssueRes(res, BAD_REQUEST, [{error: err}]);
                return;
            }
            connection.query(
                "delete from liste_produse where liste_produse.id_produs = " + itemId, function (err, result) {
                    if (err) {
                        return connection.rollback(function () {
                            console.log(err);
                            setIssueRes(res, BAD_REQUEST, [{error: err}]);
                        });
                    }
                    connection.query("delete from produse where id = " + itemId, function (err, result) {
                        if (err) {
                            return connection.rollback(function () {
                                console.log(err);
                                setIssueRes(res, BAD_REQUEST, [{error: err}]);
                            });
                        }
                        connection.commit(function (err) {
                            if (err){
                                return connection.rollback(function () {
                                    console.log(err);
                                    setIssueRes(res, BAD_REQUEST, [{error: err}]);
                                });
                            }
                            res.statusCode = OK;
                            res.json({data:deletedProduct});
                        });
                    });
            });
        });
    }
});

app.listen(3000,'10.220.12.170', function () {
    console.log('Android application listening on port 3000!');
});