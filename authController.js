const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs')
const { validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const {secret} = require('./config')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: '24h'})
}

class authController {
    async registration(req, res) {
        try {

            //получение ошибок валидатора
            const errors = validationResult(req, res)
            if(!errors.isEmpty()) {
                return res.status(400).json({message: 'Ошибка при регистрации', errors})
            }

            const {username, password} =req.body
            //поиск пользователя с таким именем
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: "Пользователь с таким именем уже существует"})
            }
            // hash пароля 
            const hashPassword = bcrypt.hashSync(password, 7)
            // нашли роль
            const userRole = await Role.findOne({value: 'USER'})
            // создание пользователя
            const user = new User({username, password: hashPassword, roles: [userRole.value]})

            // сохранение в бд
            await user.save()
            return res.json({message: 'Пользователь успешно зарегистрирован'})

        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req, res) {
        try {
            //Получение пользователя и пароля
            const {username, password} = req.body
            // Поиск пользователя в базе данных
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({messege: `Пользователь ${username} не найден `})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({messege: 'Ведён неверный пароль'})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token})

        } catch (e){
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }

    }
    

    async  getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {

        }
    
    }
}

module.exports = new authController()