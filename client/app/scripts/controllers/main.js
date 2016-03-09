'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope) {
    $("#modal_login").on('show.bs.modal', function (event) {
      delete $scope.err;
      $scope.$apply();
    });
    $("#modal_register").on('show.bs.modal', function (event) {
      delete $scope.err;
      $scope.$apply();
    });
    $("#modal_give_bonus").on('show.bs.modal', function (event) {
      delete $scope.err;
      $scope.$apply();
    });

    var checkError = function (msg) {
      if (msg.err) {
        $scope.err = msg.err;
        $scope.$apply();
        return true;
      }
      return false;
    };

    $scope.register = function () {
      $.ajax({
        url: 'http://localhost:3000/api/register',
        dataType: 'jsonp',
        crossDomain: true,
        data: {
          username: $scope.modal_register_username,
          password: $scope.modal_register_password,
          call_name: $scope.modal_register_call_name
        }
      }).done(function (msg) {
        if (checkError(msg)) return;
        $('#modal_register').modal('hide');
      });
    };
    $scope.login = function () {
      $.ajax({
        url: 'http://localhost:3000/api/login',
        dataType: 'jsonp',
        crossDomain: true,
        data: {
          username: $scope.modal_login_username,
          password: $scope.modal_login_password
        }
      }).done(function (msg) {
        if (checkError(msg)) return ;
        $scope.me = {
          call_name: msg.call_name,
          money: msg.money
        };
        $("#modal_login").modal('hide');
        $scope.$apply();
        $scope.bonus();
        });
    };

    /*
    $.ajax({
      url: 'http://localhost:3000',
      dataType: 'jsonp',
      data: {
      }
    }).done(function (msg) {
    });
    */

    $scope.logout = function () {
      $.ajax({
        url: 'http://localhost:3000/api/logout',
        dataType: 'jsonp',
        crossDomain: true,
      }).done(function (msg) {
        if (checkError(msg)) return;
        delete $scope.me;
        $scope.$apply();
      });
    };
    $scope.money = function () {
      $.ajax({
        url: 'http://localhost:3000/api/money',
        dataType: 'jsonp',
        crossDomain: true,
      }).done(function (msg) {
        if (checkError(msg)) return;
        $scope.me.money = msg.money;
        $scope.$apply();
      });
    };
    $scope.give_bonus = function () {
      $.ajax({
        url: 'http://localhost:3000/api/give_bonus',
        dataType: 'jsonp',
        crossDomain: true,
        data: {
          bless_message: $scope.modal_give_bonus_bless_message,
          bonus_count: $scope.modal_give_bonus_bonus_count,
          each_bonus_money: $scope.modal_give_bonus_each_bonus_money
        }
      }).done(function (msg) {
        if (checkError(msg)) return;
        $('#modal_give_bonus').modal('hide');
        $scope.me.money = msg.money;
        $scope.$apply();
        $scope.bonus();
      });
    };
    $scope.bonus = function () {
      $.ajax({
        url: 'http://localhost:3000/api/bonus',
        dataType: 'jsonp',
        crossDomain: true,
      }).done(function (msg) {
        if (checkError(msg)) return ;
        $scope.bonus_list = msg.bonus_list;
        $scope.$apply();
      });
    };
    $scope.get_bonus = function (bonus_id) {
      $.ajax({
        url: 'http://localhost:3000/api/get_bonus',
        dataType: 'jsonp',
        crossDomain: true,
        data: {
          id: bonus_id
        }
      }).done(function (msg) {
        if (checkError(msg)) return ;
        $scope.me.money = msg.money;
        $scope.gotted_bonus = msg.bonus;
        $scope.$apply();
        $('#modal_get_bonus').modal();
      });
    };


  });
