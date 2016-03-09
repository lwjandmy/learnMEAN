var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    call_name: { type: String, required: true },
    money: { type: Number, required: true }
});

// callback = function (err)
userSchema.methods.register = function (username, password, call_name, callback) {
    console.log(username, password, call_name);
    this.username = username;
    this.password = password;
    this.call_name = call_name;
    this.money = 100;
    this.save(callback);
};

// callback = function (err, db_user)
userSchema.statics.login = function (username, password, callback) {
    this.findOne({ username: username }, function (err, db_user) {
        if (err) return callback(err);
        if (!db_user) return callback({ message: '用户不存在' });
        if (db_user.password != password) return callback({ message: '密码不正确' });
        callback(err, db_user);
    });
};


// callback = function (err, money)
userSchema.statics.money = function (user_id, callback) {
    this.findById(user_id, function(err, db_user) {
        if (err) return callback(err);
        callback(err, db_user.money);
    });
};


// callback = function (err, left_money)
userSchema.statics.consume = function (user_id, consume_money, callback) {
    this.findById(user_id, function (err, db_user) {
        if (err) return callback(err);
        // TODO: check user money >= consume_money
        db_user.money -= consume_money;
        db_user.save(function (err) {
            if (err) return callback(err);
            callback(err, db_user.money);
        });
    });
};


// callback = function (err, total_money)
userSchema.statics.earn = function (user_id, earn_money, callback) {
    this.findById(user_id, function (err, db_user) {
        if (err) return callback(err);
        db_user.money += earn_money;
        db_user.save(function (err) {
            if (err) return callback(err);
            callback(err, db_user.money);
        });
    });
};



var userModel = mongoose.model('user', userSchema);
module.exports = userModel;
