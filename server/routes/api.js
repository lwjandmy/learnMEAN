var express = require('express');
var userModel = require('../models/user');
var bonusModel = require('../models/bonus');

var router = express.Router();

module.exports =  router;


router.get('/register', function (req, res, next) {
    var user = userModel();
    user.register(req.query.username, req.query.password, req.query.call_name, function (err) {
        res.jsonp({ err: err && err.message });
    })
});


router.get('/login', function (req, res, next) {
     userModel.login(req.query.username, req.query.password, function (err, db_user) {
         if (err) return res.jsonp({ err: err.message });
         req.session.user_id = db_user.id;
         res.jsonp({ err: null, call_name: db_user.call_name, money: db_user.money });
     });
});


router.get('/logout', function (req, res, next) {
    req.session.destroy();
    res.jsonp({ err: null });
});


router.get('/money', function (req, res, next) {
    // TODO: check logined!
    userModel.money(req.session.user_id, function (err, money) {
        if (err) return res.jsonp({ err: err.message });
        res.jsonp({ err: err, money: money });
    });
});


router.get('/give_bonus', function (req, res, next) {
    var bonus = bonusModel();
    // TODO: check logined!
    bonus.give_bonus(req.session.user_id, req.query.bless_message, req.query.bonus_count, req.query.each_bonus_money, function (err, money) {
        if (err) return res.jsonp({ err: err.message });
        res.jsonp({ err: null, money: money });
    });
});


router.get('/bonus', function (req, res, next) {
    bonusModel.bonus(function(err, bonus_list) {
        if (err) return res.jsonp({ err: err.message });
        res.jsonp({ err: null, bonus_list: bonus_list });
    });
});


router.get('/get_bonus', function (req, res, next) {
    // TODO: check logined!
    bonusModel.get_bonus(req.query.id, req.session.user_id, function (err, money, bonus) {
        if (err) return res.jsonp({ err: err.message });
        res.jsonp({ err: null, money: money, bonus: bonus });
    });
});