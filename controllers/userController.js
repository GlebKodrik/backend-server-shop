const apiError = require('./../error/apiError')
const bcrypt = require('bcrypt')
const {User, Basket} = require('../models/models')

class UserController {
    async register(req, res, next) {
        const {email, password, role} = req.body;
        if(!email || !password) {
            return next(apiError.badRequest('Вы не передали email или password!'))
        }
        const candidate = await User.findOne({where: {email}})
        if(candidate) {
            return next(apiError.badRequest('Данный email существует!'))
        }
        const user = await User.create({email, role, password })
        const basket = await Basket.create({userId: user.id})
        return res.json({user})
    }
    async login(req, res) {
        const {email, password} = req.body;
        const user = await User.findOne({where: {email}})
        if(!user) {
            return next(apiError.badRequest('Такого пользователя не существует!'))
        }
        if(password !== user.password) {
            return next(apiError.badRequest('Такого пользователя не существует!'))
        }
        return res.json({user})
    }
    async checkAuth(req, res, next) {
        const {id} = req.query;
        if(!id) {
            return next(apiError.badRequest('Не переданы параметры!'))
        }
        res.json(id)
    }
}

module.exports = new UserController()