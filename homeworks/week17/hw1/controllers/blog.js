const db = require('../models')

const { Article, User, About, Category } = db
const max = 6
const limit = 5

// generate csrfToken
function csrfTokenGenerator(max) {
  let text = ''
  const possible = 'abcdefghijklmnopqrstuvwxyz1234567890'
  for (let i = 0; i < max; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const blogController = {
  isLogin: (req, res, next) => {
    if (req.session.username) {
      next()
    } else {
      res.redirect('login')
    }
  },

  isMysite: (req, res, next) => {
    if (req.session.sitename === req.params.visitsite) {
      req.mysite = true
      return next()
    }
    req.mysite = false
    return next('route')
  },

  getAboutByUserId: (req, res, next) => {
    About.findOne({
      where: {
        userId: req.session.userId
      }
    }).then((about) => {
      // 找不到關於我就導到編輯關於我
      if (!about) {
        return res.render('edit-about', {
          about: null,
          mysite: true
        })
      }
      req.about = about
      return next()
    }).catch((err) => res.redirect('/login'))
  },

  getAllCategoriesByUserId: (req, res, next) => {
    Category.findAll({
      where: {
        userId: req.session.userId
      },
      order: [['createdAt', 'DESC']]
    }).then((categories) => {
      req.categories = categories
      return next()
    }).catch((err) =>
      res.redirect('/login')
    )
  },

  getAllArticlesByUserId: (req, res, next) => {
    // page 默認為 1
    let page
    if ('page' in req.query) {
      page = Number(req.query.page)
    } else {
      page = 1
    }
    req.page = page

    // 從第幾篇文章開始取
    const offset = limit * (page - 1)
    req.offset = offset

    // categoryId
    let categoryId
    const where = {
      userId: req.session.userId
    }
    if ('categoryId' in req.query) {
      categoryId = Number(req.query.categoryId)
      where.categoryId = categoryId
    }

    // 取出文章
    Article.findAll({
      where,
      include: Category,
      order: [['createdAt', 'DESC']]
    }).then((articles) => {
      // 沒有文章跳到新增文章
      if (!articles.length) {
        return res.redirect('/write')
      }
      req.articles = articles
      return next()
    }).catch((err) =>
      res.redirect('back')
    )
  },

  getAllCategoriesBySitename: (req, res, next) => {
    // 非本人
    User.findOne({
      where: {
        sitename: req.params.visitsite
      },
      include: Category,
      order: [[Category, 'createdAt', 'DESC']]
    }).then((user) => {
      req.categories = user.Categories
      return next()
    }).catch((err) =>
      res.redirect('back')
    )
  },

  getAllArticlesBySitename: (req, res, next) => {
    // 非本人
    let page
    if ('page' in req.query) {
      page = Number(req.query.page)
    } else {
      page = 1
    }
    req.page = page
    const offset = limit * (page - 1)
    req.offset = offset
    // 處理 categoryId
    let categoryId
    const findOneParameter = {
      where: {
        sitename: req.params.visitsite
      },
      include: Article,
      order: [[Article, 'createdAt', 'DESC']]
    }
    if ('categoryId' in req.query) {
      categoryId = Number(req.query.categoryId)
      findOneParameter.include = [{
        model: Article,
        where: { categoryId }
      }]
    }
    User.findOne(findOneParameter).then((user) => {
      req.user = user
      req.articles = req.user.Articles
      return next()
    }).catch((err) =>
      res.redirect('/login')
    )
  },

  getAboutBySitename: (req, res, next) => {
    // 非本人
    User.findOne({
      where: {
        sitename: req.params.visitsite
      },
      include: About
    }).then((user) => {
      req.user = user;
      [req.about] = user.Abouts
      return next()
    }).catch((err) =>
      res.redirect('back')
    )
  },

  getArticleByQueryId: (req, res, next) => {
    // 用 id 找出文章
    Article.findOne({
      where: {
        id: req.query.id
      },
      include: [User, Category]
    }).then((article) => {
      if (!article) {
        return res.redirect('/login')
      }
      req.article = article
      return next()
    }).catch((err) =>
      res.redirect('back')
    )
  },

  getCategoryByQueryId: (req, res, next) => {
    // 先找出文章
    Category.findOne({
      where: {
        id: req.query.id
      }
    }).then((category) => {
      if (!category) {
        return res.redirect('/login')
      }
      req.category = category
      return next()
    }).catch((err) =>
      res.redirect('back')
    )
  },

  renderArticle: (req, res, next) => {
    // 檢查是不是本人的文章
    const { mysite, categories, article } = req
    if (mysite) {
      return res.render('article', {
        mysite,
        categories,
        article
      })
    }
    const { blogname, desc, sitename } = article.User
    return res.render('article', {
      mysite,
      blogname,
      desc,
      sitename,
      categories,
      article
    })
  },

  renderEdit: (req, res, next) => {
    // 檢查是不是本人的文章
    const { categories, article } = req
    if (req.session.userId === article.userId) {
      return res.render('edit', {
        mysite: true,
        categories,
        article
      })
    }
    return next()
  },

  renderEditCategory: (req, res, next) => {
    // 檢查是不是本人的文章
    const { categories, category } = req
    if (req.session.userId === category.userId) {
      return res.render('edit-category', {
        mysite: true,
        categories,
        category
      })
    }
    next()
  },

  renderEditAbout: (req, res, next) => {
    const { about, categories } = req
    return res.render('edit-about', {
      mysite: true,
      categories,
      about
    })
  },

  renderCategory: (req, res, next) => {
    const { categories } = req
    return res.render('category', {
      mysite: true,
      navbarId: 1,
      categories
    })
  },

  renderDelete: (req, res, next) => {
    const { categories, article } = req

    // 製作 csrf token
    const csrfToken = csrfTokenGenerator(max)
    req.session.csrfToken = csrfToken

    // 檢查是不是本人的文章
    if (req.session.userId === article.userId) {
      return res.render('delete', {
        mysite: true,
        categories,
        article,
        csrfToken
      })
    }
    next()
  },

  renderDeleteCategory: (req, res, next) => {
    const { categories, category } = req
    // 製作 csrf token
    const csrfToken = csrfTokenGenerator(max)
    // 檢查是不是本人的文章
    req.session.csrfToken = csrfToken
    if (req.session.userId === category.userId) {
      return res.render('delete-category', {
        mysite: true,
        categories,
        category,
        csrfToken
      })
    }
    next()
  },

  renderIndex: (req, res, next) => {
    const { mysite, articles, categories, offset, page } = req
    const totalArticle = articles.length // 所有文章
    const totalPage = Math.ceil(totalArticle / limit) // 總頁數
    const slicedArticles = articles.slice(offset, offset + limit) // 取出要 render 的文章
    // 如果頁數超過回到第一頁
    if (page > totalPage) {
      return res.redirect(`/blog/${req.params.sitename}?page=1`)
    }
    // render 的參數
    const renderParameter = {
      mysite,
      articles: slicedArticles,
      categories,
      page,
      totalArticle,
      totalPage,
      limit
    }
    if ('categoryId' in req.query) {
      renderParameter.categoryId = req.query.categoryId
    } else {
      renderParameter.categoryId = null
    }

    // 自己的主頁
    if (req.mysite) {
      return res.render('index', renderParameter)
    }
    const { blogname, desc, sitename } = req.user
    renderParameter.blogname = blogname
    renderParameter.desc = desc
    renderParameter.sitename = sitename
    return res.render('index', renderParameter)
  },

  renderAbout: (req, res, next) => {
    if (req.mysite) {
      const { categories, about } = req
      return res.render('about', {
        mysite: true,
        navbarId: 3,
        categories,
        about
      })
    }
    const { user, categories } = req
    const { blogname, desc, sitename } = user
    if (!user.Abouts.length) {
      return res.redirect(`/blog/${sitename}`)
    }
    return res.render('about', {
      mysite: false,
      categories,
      about: user.Abouts[0],
      blogname,
      desc,
      sitename
    })
  },

  renderAdmin: (req, res, next) => {
    const { categories, articles } = req
    return res.render('admin', {
      mysite: true,
      navbarId: 2,
      categories,
      articles
    })
  },

  checkEditInput: (req, res, next) => {
    const { title, content } = req.body
    const { id } = req.query
    if (!title || !content || !id) {
      req.flash('errorMessage', '資料不齊全')
      return res.redirect('back')
    }
    next()
  },

  checkEditCategoryInput: (req, res, next) => {
    const { name } = req.body
    if (!name) {
      req.flash('errorMessage', '資料不齊全')
      return res.redirect('back')
    }
    next()
  },

  checkEditAboutInput: (req, res, next) => {
    const { content } = req.body
    if (!content) {
      req.flash('errorMessage', '資料不齊全')
      return res.redirect('back')
    }
    next()
  },

  checkWriteInput: (req, res, next) => {
    const { title, content } = req.body
    if (!title || !content) {
      req.flash('errorMessage', '資料不齊全')
      return res.redirect('back')
    }
    next()
  },

  checkWriteCategoryInput: (req, res, next) => {
    const { name } = req.body
    if (!name) {
      return res.redirect('back')
    }
    next()
  },

  checkDeleteInput: (req, res, next) => {
    if (!req.body.csrfToken) {
      return res.redirect('/admin')
    }
    next()
  },

  checkDeleteCategoryInput: (req, res, next) => {
    if (!req.body.csrfToken) {
      return res.redirect('/category')
    }
    next()
  },

  checkQueryId: (req, res, next) => {
    if (!req.query.id) {
      return res.redirect('/login')
    }
    next()
  },

  handleEdit: (req, res, next) => {
    const { title, content, categoryId } = req.body
    const { article } = req
    // 確認是不是本人的文章
    if (article.userId === req.session.userId) {
      article.update({
        title,
        content,
        categoryId: categoryId || null
      }).then(() =>
        res.redirect(`/blog/${req.session.sitename}`)
      ).catch((err) => {
        req.flash('errorMessage', '系統錯誤')
        return next()
      })
    } else {
      next()
    }
  },

  handleEditCategory: (req, res, next) => {
    const { name } = req.body
    const { category } = req
    // 確認是本人的分類
    if (category.userId === req.session.userId) {
      category.update({
        name
      }).then(() =>
        res.redirect('/category')
      ).catch((err) => {
        req.flash('errorMessage', '系統錯誤')
        return next()
      })
    } else {
      next()
    }
  },

  handleDelete: (req, res, next) => {
    const { csrfToken } = req.body
    const { article } = req

    // 檢查是否是自己的文章且 csrf token 正確
    if (article.userId === req.session.userId && csrfToken === req.session.csrfToken) {
      article.destroy({
        where: {
          id: req.query.id
        }
      }).then(() => {
        // 清除 session 儲存的 csrf token
        req.session.csrfToken = null
        return res.redirect('/admin')
      }).catch((err) =>
        next()
      )
    } else {
      next()
    }
  },

  handleDeleteCategory: (req, res, next) => {
    const { csrfToken } = req.body
    const { category } = req
    if (category.userId === req.session.userId && csrfToken === req.session.csrfToken) {
      category.destroy({
        where: {
          id: req.query.id
        }
      }).then(() => {
        // 刪除成功後清除 session 的 csrf token
        req.session.csrfToken = null
        return res.redirect('/category')
      }).catch((err) =>
        next()
      )
    } else {
      next()
    }
  },

  renderWrite: (req, res) => {
    const { categories } = req
    res.render('write', {
      mysite: true,
      categories
    })
  },

  handleWrite: (req, res, next) => {
    // 新增文章
    const { title, content, categoryId } = req.body
    Article.create({
      userId: req.session.userId,
      title,
      content,
      categoryId: categoryId || null
    }).then(() =>
      res.redirect(`/blog/${req.session.sitename}`)
    ).catch((err) => {
      req.flash('errorMessage', '系統錯誤')
      return next()
    })
  },

  handleWriteCategory: (req, res, next) => {
    // 新增文章
    const { name } = req.body
    Category.create({
      userId: req.session.userId,
      name
    }).then(() =>
      res.redirect('/category')
    ).catch((err) => {
      req.flash('errorMessage', err.toString())
      return next()
    })
  },

  handleEditAbout: (req, res, next) => {
    const { content } = req.body
    About.findOne({
      where: {
        userId: req.session.userId
      }
    }).then((about) => {
      if (!about) {
        About.create({
          userId: req.session.userId,
          content
        }).then(() =>
          res.redirect(`/about/${req.session.sitename}`)
        ).catch((err) => {
          req.flash('errorMessage', '系統錯誤')
          return next()
        })
      } else {
        about.update({
          content
        }).then(() =>
          res.redirect(`/about/${req.session.sitename}`)
        ).catch((err) => {
          req.flash('errorMessage', '系統錯誤')
          return next()
        })
      }
    }).catch((err) => {
      req.flash('errorMessage', '系統錯誤')
      return next()
    })
  },

  redirectBack: (req, res, next) => {
    if (req.headers.referer) {
      return res.redirect('back')
    }
    return res.redirect('/login')
  }
}

module.exports = blogController
