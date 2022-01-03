const axios = require("axios")

async function GetGoogleUserInfo(access_token) {
    const {data} = await axios({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        method: 'get',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    console.log(data); // { id, email, name, given_name, family_name, family_name, link, picture, gender, locale}
    return data;
};

async function GetAccessTokenFromCode(code) {
    const {data} = await axios({
        url: `https://oauth2.googleapis.com/token`,
        method: 'post',
        data: {
            client_id: process.env.APP_ID_GOES_HERE,
            client_secret: process.env.APP_SECRET_GOES_HERE,
            redirect_uri: 'https://www.example.com/authenticate/google',
            grant_type: 'authorization_code',
            code,
        },
    });
    console.log(data); // { access_token, expires_in, token_type, refresh_token }
    return data.access_token;
};

module.exports = {GetAccessTokenFromCode, GetGoogleUserInfo}