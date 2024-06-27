const jwt = require('jsonwebtoken')
const secret = require('../util/config').secretkey

const verify = async (token, key = secret) => {
    if (!token) return {}
    return new Promise((resolve, reject) =>
        jwt.verify(token, key, (err, decoded) =>
            err ? reject({}) : resolve(decoded)
        )
    )
}

const sign = async (payload, expiresIn = '1d', key = secret) => {
    return new Promise((resolve, reject) =>
        jwt.sign(payload, key, { expiresIn }, (err, token) =>
            err ? reject({}) : resolve(token)
        )
    )
}

module.exports = {
    verify,
    sign
}
