const bcrypt = require('bcrypt')
const db = require('../models')

const { User } = db
const max = 8
const saltRounds = 10

// generate sitename
function sitenameGenerator(max) {
  let sitename = ''
  const possible = 'abcdefghijklmnopqrstuvwxyz1234567890'
  for (let i = 0; i < max; i++) {
    sitename += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return sitename
}

const userController = {
  isLogin: (req, res, next) => {
    // 有登入
    if (req.session.username) {
      return next()
    }
    // 沒登入直接跳到 render
    next('route')
  },

  checkRegisterInput: (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
      req.flash('errorMessage', '缺少必要欄位')
      return res.redirect('back')
    }
    next()
  },

  checkSettingInput: (req, res, next) => {
    const { blogname, desc } = req.body
    if (!blogname || !desc) {
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
      const sitename = sitenameGenerator(max)
      User.create({
        username,
        password: hash,
        sitename
      }).then((user) => {
        // 產生一組新的 session id
        req.session.regenerate((err) => {
          if (err) {
            req.flash('errorMessage', '系統錯誤')
            return next()
          }
          req.session.username = username // 在 session 存進使用者名稱
          req.session.userId = user.id // 在 session 存進使用者 id
          req.session.sitename = sitename // 在 session 存進個人網站名稱
          return res.redirect('/setting') // 進入設置畫面
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

  handleSetting: (req, res, next) => {
    const { blogname, desc } = req.body
    User.update(
      {
        blogname,
        desc
      },
      {
        where: {
          id: req.session.userId
        }
      }
    ).then(() => {
      req.session.blogname = blogname // 在 session 存進部落格名稱
      req.session.desc = desc // 在 session 存進部落格介紹
      res.redirect(`/blog/${req.session.sitename}`) // 進入個人主頁
    }).catch((err) => {
      req.flash('errorMessage', err.toString())
      return next()
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
          req.session.userId = user.id // 在 session 存進使用者 id
          req.session.sitename = user.sitename // 在 session 存進個人網站名稱
          req.session.blogname = user.blogname // 在 session 存進部落格名稱
          req.session.desc = user.desc // 在 session 存進部落格介紹
          return res.redirect(`/blog/${req.session.sitename}`) // 進入個人主頁
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
        mysite: true,
        categories: req.categories
      })
    }
    // 沒登入
    return res.render('register', {
      mysite: false
    })
  },

  renderSetting: (req, res, next) => {
    const { categories } = req
    res.render('setting', {
      mysite: true,
      categories
    })
  },

  renderLogin: (req, res) => {
    // 有登入
    if (req.session.username) {
      return res.render('login', {
        mysite: true,
        categories: req.categories
      })
    }
    // 沒登入
    return res.render('login', {
      mysite: false
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
