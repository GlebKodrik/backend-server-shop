const uuid = require('uuid')
const path = require('path')
const {Device, DeviceInfo, DeviceCustomized} = require('../models/models')
const apiError = require('../error/apiError')

class DeviceController {
    async create(req, res, next) {
        try {
            let {name, price, brandId, typeId, info , customized} = req.body
            let device;
            try {
                const {img} = req.files
                let fileName = uuid.v4() + ".jpg"
                img.mv(path.resolve(__dirname, '..', 'static', fileName))
                device = await Device.create({name, price, brandId, typeId, img: fileName})
            } catch (e) {
                device = await Device.create({name, price, brandId, typeId})
            }

            if(customized) {
                customized.forEach((i) => {
                    DeviceCustomized.create({
                        color: i.color,
                        img: i.img,
                    })
                })
            }

            if (info) {
                info.forEach((i) => {
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                    })
                })
            }

            return res.json(device)
        } catch (e) {
            next(apiError.badRequest(e.message))
        }


    }
    async getAll(req, res) {
        let {typeId, brandId, limit, page} = req.query;
        page = page || 1
        limit = limit || 10
        let offset = page * limit - limit

        let device;
        if (!typeId && !brandId) {
            device = await Device.findAndCountAll({limit, offset})
        }
        if (brandId && !typeId) {
            device = await Device.findAndCountAll({where: {brandId}, limit, offset})
        }
        if (!brandId && typeId) {
            device = await Device.findAndCountAll({where: {typeId}, limit, offset})
        }
        if (brandId && typeId) {
            device = await Device.findAndCountAll({where: {typeId, brandId}, limit, offset})
        }
        return res.json(device)
    }

    async getOne(req, res) {
        const {id} = req.params
        const device = await Device.findOne({
            where: {id},
            include: [{model: DeviceInfo, as: 'info'},{model: DeviceCustomized, as: 'customized'}]
        })
        return res.json(device)
    }

    async deleteDevice(req, res, next) {
        const {id} = req.params
        try {
            await Device.destroy({where: {id}})
            return res.status(204)
        } catch (e) {
            next(apiError.badRequest(e.message))
        }

    }
}

module.exports = new DeviceController()