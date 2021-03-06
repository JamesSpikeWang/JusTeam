const dbConnection = require("./dbConnection");

class Message {
    constructor() {
        if (new.target === Message) throw new TypeError("Abstract Class 'Message' cannot be instantiated.");
        this.messageType = "";
    }

    async send(users, callback) {
        try {
            var messageID = await dbConnection.insertMessageBody(this.messageType, JSON.stringify(this.content));
            if (users instanceof Array) {
                for (var i = 0; i < users.length; i++) {
                    dbConnection.insertUserNotification(users[i], messageID);
                }
            } else dbConnection.insertUserNotification(users, messageID);
        } catch (err) {
            if (callback !== undefined) {
                callback(err);
            }
        }
    }
}

module.exports = Message;
