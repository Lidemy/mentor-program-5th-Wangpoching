const db = require('../models')

const { User } = db

const UserController = {
  editInfo: async(req, res, next) => {
    const { userId } = req
    const { description } = req.body
    try {
      const result = await User.update({
        description
      },
      {
        where: {
          id: userId
        }
      })
      if (result) {
        return res.status(200).json({
          success: true
        })
      }
      return res.status(400).json({
        success: false,
        errorMessage: ['更新失敗']
      })
    } catch (err) {
      return res.status(400).json({
        success: false,
        errorMessage: [err]
      })
    }
  }
}

module.exports = UserController
