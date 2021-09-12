const bcrypt = require('bcrypt')
const db = require('../models')

const { User } = db
const saltRounds = 10

const userController = {
  isLogin: (req, res, next) => {
    // 有登入
    if (req.session.username) {
      return next()
    }
    // 沒登入直接跳到 render
    return res.redirect('login')
  },

  checkRegisterInput: (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
      req.flash('errorMessage', '缺少必要欄位')
      return res.redirect('back')
    }
    next()
  },

  checkLoginInput: (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
      req.flash('errorMessage', '缺少必要欄位')
      return res.redirect('back')
    }
    next()
  },

  handleRegister: (req, res, next) => {
    const { username, password } = req.body
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        req.flash('errorMessage', '系統錯誤')
        return next()
      }
      User.create({
        username,
        password: hash
      }).then((user) => {
        // 產生一組新的 session id
        req.session.regenerate((err) => {
          if (err) {
            req.flash('errorMessage', '系統錯誤')
            return next()
          }
          req.session.username = username // 在 session 存進使用者名稱
          return res.redirect('/admin') // 進入後台
        })
      }).catch((err) => {
        if (err.name === 'SequelizeUniqueConstraintError') {
          req.flash('errorMessage', '帳號已被使用')
          return next()
        }
        req.flash('errorMessage', '系統錯誤')
        return next()
      })
    })
  },

  handleLogin: (req, res, next) => {
    const { username, password } = req.body
    // 檢查帳號
    User.findOne({
      where: {
        username
      }
    }).then((user) => {
      if (!user) {
        req.flash('errorMessage', '帳號不存在')
        return next()
      }
      // 檢查密碼
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          req.flash('errorMessage', '系統錯誤')
          return next()
        }
        if (!result) {
          req.flash('errorMessage', '密碼錯誤')
          return next()
        }
        // 產生一組新的 session id
        req.session.regenerate((err) => {
          if (err) {
            req.flash('errorMessage', '系統錯誤')
            return next()
          }
          req.session.username = username // 在 session 存進使用者名稱
          return res.redirect('/admin') // 進入個人主頁
        })
      })
    }).catch((err) => {
      req.flash('errorMessage', '系統錯誤')
      return next()
    })
  },

  handleLogout: (req, res, next) => {
    // 摧毀 session 後導回上一頁
    req.session.destroy((err) =>
      next()
    )
  },

  renderRegister: (req, res) => {
    // 有登入
    if (req.session.username) {
      return res.render('register', {
        isLogin: true
      })
    }
    // 沒登入
    return res.render('register', {
      isLogin: false
    })
  },

  renderLogin: (req, res) => {
    // 有登入
    if (req.session.username) {
      return res.render('login', {
        isLogin: true
      })
    }
    // 沒登入
    return res.render('login', {
      isLogin: false
    })
  },

  redirectBack: (req, res, next) => {
    if (req.headers.referer) {
      return res.redirect('back')
    }
    return res.redirect('/login')
  }
}

module.exports = userController
