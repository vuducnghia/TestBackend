const schedule = require('node-schedule')
const model = require("./models/models")
const firebaseAdmin = require("./firebase")
const _ = require("lodash");

function JWTAuth(user) {
    return "token"
}

function SendNotification() {
    try {
        schedule.scheduleJob('0 30 11 * * *', async () => {
            users = model.GetUsersEnableNotification()
            const chunks = _.chunk(users, 500);

            const promises = chunks.map((u) => {
                const tokens = [];

                u.forEach((item) => {
                    if (item.token) {
                        tokens.push(item.token);
                    }
                });

                const payload = {
                    tokens,
                    title: "Title",
                    body: "Body",
                };

                return firebaseAdmin.sendMulticastNotification(payload);
            });

            await Promise.all(promises);
        })
    }catch (e) {
        throw e
    }
}

module.exports = {JWTAuth, SendNotification}