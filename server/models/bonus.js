var mongoose = require('mongoose');
var userModel = require('./user');
var bonusSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, required: true },
    bless_message: String,
    bonus_count: { type: Number, required: true },
    each_bonus_money: { type: Number, required: true }
});


// callback = function (err, money)
bonusSchema.methods.give_bonus = function (sender_id, bless_message, bonus_count, each_bonus_money, callback) {
    // 1. 获取发红包者信息
    // 2. 保存发红包者信息
    userModel.consume(sender_id, bonus_count * each_bonus_money, function (err, left_money) {
        if (err) return callback(err);
        // 3. 保存红包信息
        var bonus = bonusModel();
        bonus.sender = sender_id;
        bonus.bless_message = bless_message;
        bonus.bonus_count = bonus_count;
        bonus.each_bonus_money = each_bonus_money
        bonus.save(function (err) {
            if (err) return callback(err);
            callback(err, left_money);
        });
    });
};


// callback = function (err, bonus_list);
bonusSchema.statics.bonus = function (callback) {
    this.find(function (err, db_bonus_list) {
        if (err) return callback(err);

        var bonus_list = [];
        var left_cycle = 0;
        db_bonus_list.forEach(function (db_bonus, i) {
            bonus_list[i] = {
                id: db_bonus.id,
                bless_message: db_bonus.bless_message,
                bonus_count: db_bonus.bonus_count,
                each_bonus_money: db_bonus.each_bonus_money
            };
            left_cycle++;
            userModel.findById(db_bonus.sender, function (err, sender) {
                left_cycle--;
                if (err) return callback(err);
                bonus_list[i].sender_call_name = sender.call_name;
                if (left_cycle == 0) {
                    callback(err, bonus_list);
                }
            });
        });
    });
};

// callback = function (err, money, bonus)
// money: 抢红包后用户总金额
// bonus: 红包信息, { bless_message, each_bonus_money, sender_call_name }
bonusSchema.statics.get_bonus = function (bonus_id, getter_id, callback) {
    // 1. 减红包剩余数量
    bonusModel.findById(bonus_id, function (err, db_bonus) {
        if (err) return callback(err);
        // TODO: check bonus_count > 0
        db_bonus.bonus_count--;
        db_bonus.save(function (err) {
            if (err) return callback(err);
            // 2. 加用户金额
            userModel.earn(getter_id, db_bonus.each_bonus_money, function (err, total_money) {
                if (err) return callback(err);

                // 3. 获取红包拥有者信息
                userModel.findById(db_bonus.sender, function (err, db_sender) {
                    if (err) return callback(err);
                    callback(err, total_money, {
                        bless_message: db_bonus.bless_message,
                        each_bonus_money: db_bonus.each_bonus_money,
                        sender_call_name: db_sender.call_name
                    });
                });
            });
        });
    });
};







var bonusModel = mongoose.model('bonus', bonusSchema);
module.exports = bonusModel;
