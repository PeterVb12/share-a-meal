const secretkey = process.env.JWT_SECRET || 'verysecretkey'

const config = {
    secretkey
}

module.exports = config
