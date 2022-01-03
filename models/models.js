const {db} = require("./connection")

async function GetUsersEnableNotification() {
    return await db.query(`
        SELECT * FROM notification_settings AS n
        JOIN users AS u ON n.user_id = u.id
        WHERE is_enable = $1`, true)

}

async function GetPurchasedProductsById(user_id) {
    return await db.query(`
        SELECT * FROM user_product AS up
        RIGHT JOIN products AS p ON up.product_id = p.id
        WHERE user_id = $1 AND status = $2
        ORDER BY number ASC`, [user_id, "purchased"])

}

async function GetUserBySocialID(id) {
    return (await db.query(`
        SELECT users.* FROM social_networks 
        JOIN users ON social_networks.user_id = users.id 
        WHERE social_id = $1`, id))[0]
}

async function GetUserByEmail(email) {
    return (await db.query(`SELECT * FROM users WHERE email = $1`, email))[0]
}

async function CreateUserByEmail(email, name) {
    return (await db.query(`INSERT INTO users (email, name) VALUES($1, $2) RETURNING *`, [email, name]))[0]
}

async function CreateSocialNetwork(user_id, social_id, type) {
    return await db.query(`INSERT INTO social_networks (user_id, social_id, type) VALUES($1, $2, $3)`, [user_id, social_id, type])
}

module.exports = {
    GetUsersEnableNotification,
    GetPurchasedProductsById,
    GetUserBySocialID,
    GetUserByEmail,
    CreateUserByEmail,
    CreateSocialNetwork
}