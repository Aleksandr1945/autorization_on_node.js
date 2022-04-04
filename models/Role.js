const {Schema, model} = require('mongoose')

//схема хранения пользователя в бд
const Role = new Schema ({
    value: {type: String, unique: true, default: 'USER'},
})

module.exports = model ('Role', Role)