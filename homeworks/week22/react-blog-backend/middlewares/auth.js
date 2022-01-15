const admin = require('../utils/firebase')
const db = require('../models')

const { User } = db

async function checkAuth(req, res, next) {
  if (!req.token) {
    return res.status(400).json({
      success: false,
      errorMsg: ['請攜帶 jwt Token']
    })
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(req.token)
    const user = await User.findOne({
      where: {
        email: decodedToken.email
      }
    })
    if (!user) {
      return res.status(400).json({
        success: false,
        errorMsg: ['User not found']
      })
    }
    req.userId = user.id
    next()
  } catch (err) {
    res.status(400).json({
      success: false,
      errorMsg: err
    })
  }
}

async function register(req, res) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(req.token)
    const { uid, email } = decodedToken
    let name
    let avatar
    if (req.query.type) {
      name = req.query.name
      avatar = 'https://i.imgur.com/YaaDSF3.png'
    } else {
      name = decodedToken.name
      avatar = decodedToken.picture
    }
    const authProvider = decodedToken.firebase.sign_in_provider
    const checkUser = await User.findOne({
      where: {
        id: uid
      }
    })
    if (checkUser) {
      return res.status(200).json({
        success: true
      })
    }
    await User.create({
      id: uid,
      name,
      email,
      authProvider,
      avatar
    })
    res.status(200).json({
      success: true
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      errorMsg: err
    })
  }
}

async function getMe(req, res) {
  if (!req.token) {
    return res.status(400).json({
      success: false,
      errorMsg: ['請攜帶 jwt Token']
    })
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(req.token)
    const user = await User.findOne({
      where: {
        email: decodedToken.email
      }
    })
    if (!user) {
      return res.status(400).json({
        success: false,
        errorMsg: ['User not found']
      })
    }
    const { name, email, avatar, description } = user
    return res.status(200).json({
      success: true,
      data: {
        avatar,
        name,
        email,
        description
      }
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      errorMsg: err
    })
  }
}

module.exports = {
  register,
  checkAuth,
  getMe
}
