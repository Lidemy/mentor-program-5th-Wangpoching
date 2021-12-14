const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const userController = require('./controllers/user')
const blogController = require('./controllers/blog')

const app = express()
const port = 5001

app.set('trust proxy', 1) // trust first proxy
app.set('view engine', 'ejs') // use ejs as template engine
// secret: seed for hash; resave: force session to store; saveUninitialized: force to save new and not modified session
app.use(session({
  secret: process.env.SESSIONSECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true } // only https will set cookie
}))
app.use(bodyParser.urlencoded({ extended: false })) // parses urlencoded bodies
app.use(bodyParser.json()) // enable json type response
app.use(flash()) // enable flash
// set enviromental variables
app.use((req, res, next) => {
  res.locals.username = req.session.username
  res.locals.blogname = req.session.blogname
  res.locals.desc = req.session.desc
  res.locals.sitename = req.session.sitename
  res.locals.categories = null
  res.locals.categoryId = null
  res.locals.navbarId = null // category: 1; admin: 2; about: 3
  res.locals.pagesPerPagination = 5
  res.locals.errorMessage = req.flash('errorMessage')
  next()
})
// set static resources route
app.use(express.static(path.join(__dirname, 'public')))
app.use((req, res, next) => {
  res.header('Content-Security-Policy', "style-src-elem blog.bocyun.tw 'unsafe-inline'; script-src-elem blog.bocyun.tw cdn.ckeditor.com 'unsafe-inline'")
  next()
})

// handle login/register/logout/setting
app.get('/login', userController.isLogin, blogController.getAllCategoriesByUserId, userController.renderLogin)
app.get('/login', userController.renderLogin)
app.post('/login', userController.checkLoginInput, userController.handleLogin, userController.redirectBack)

app.get('/register', userController.isLogin, blogController.getAllCategoriesByUserId, userController.renderRegister)
app.get('/register', userController.renderRegister)
app.post('/register', userController.checkRegisterInput, userController.handleRegister, userController.redirectBack)

app.get('/setting', userController.isLogin, blogController.getAllCategoriesByUserId, userController.renderSetting)
app.get('/setting', userController.redirectBack)
app.post('/setting', userController.checkSettingInput, userController.handleSetting, userController.redirectBack)

app.get('/logout', userController.handleLogout, userController.redirectBack)

// handle article
app.get('/blog/:visitsite', blogController.isMysite, blogController.getAllCategoriesByUserId, blogController.getAllArticlesByUserId, blogController.renderIndex, blogController.redirectBack)
app.get('/blog/:visitsite', blogController.getAllCategoriesBySitename, blogController.getAllArticlesBySitename, blogController.renderIndex, blogController.redirectBack)

app.get('/article/:visitsite', blogController.checkQueryId, blogController.isMysite, blogController.getAllCategoriesByUserId, blogController.getArticleByQueryId, blogController.renderArticle, blogController.redirectBack)
app.get('/article/:visitsite', blogController.getAllCategoriesBySitename, blogController.getArticleByQueryId, blogController.renderArticle, blogController.redirectBack)

app.get('/edit', blogController.checkQueryId, blogController.isLogin, blogController.getAllCategoriesByUserId, blogController.getArticleByQueryId, blogController.renderEdit, blogController.redirectBack)
app.post('/edit', blogController.checkEditInput, blogController.isLogin, blogController.getArticleByQueryId, blogController.handleEdit, blogController.redirectBack)

app.get('/write', blogController.isLogin, blogController.getAllCategoriesByUserId, blogController.renderWrite)
app.post('/write', blogController.checkWriteInput, blogController.isLogin, blogController.handleWrite, blogController.redirectBack)

app.get('/admin', blogController.isLogin, blogController.getAllCategoriesByUserId, blogController.getAllArticlesByUserId, blogController.renderAdmin)

app.get('/delete', blogController.checkQueryId, blogController.isLogin, blogController.getAllCategoriesByUserId, blogController.getArticleByQueryId, blogController.renderDelete, blogController.redirectBack)
app.post('/delete', blogController.checkQueryId, blogController.checkDeleteInput, blogController.isLogin, blogController.getArticleByQueryId, blogController.handleDelete, blogController.redirectBack)

// handle about
app.get('/about/:visitsite', blogController.isMysite, blogController.getAllCategoriesByUserId, blogController.getAboutByUserId, blogController.renderAbout, blogController.redirectBack)
app.get('/about/:visitsite', blogController.getAllCategoriesBySitename, blogController.getAboutBySitename, blogController.renderAbout, blogController.redirectBack)

app.get('/edit-about', blogController.isLogin, blogController.getAllCategoriesByUserId, blogController.getAboutByUserId, blogController.renderEditAbout, blogController.redirectBack)
app.post('/edit-about', blogController.checkEditAboutInput, blogController.isLogin, blogController.handleEditAbout, blogController.redirectBack)

// handle category
app.get('/category', blogController.isLogin, blogController.getAllCategoriesByUserId, blogController.renderCategory, blogController.redirectBack)

app.get('/edit-category', blogController.checkQueryId, blogController.isLogin, blogController.getAllCategoriesByUserId, blogController.getCategoryByQueryId, blogController.renderEditCategory, blogController.redirectBack)
app.post('/edit-category', blogController.checkQueryId, blogController.checkEditCategoryInput, blogController.isLogin, blogController.getCategoryByQueryId, blogController.handleEditCategory, blogController.redirectBack)

app.post('/write-category', blogController.checkWriteCategoryInput, blogController.isLogin, blogController.handleWriteCategory, blogController.redirectBack)

app.get('/delete-category', blogController.checkQueryId, blogController.isLogin, blogController.getAllCategoriesByUserId, blogController.getCategoryByQueryId, blogController.renderDeleteCategory, blogController.redirectBack)
app.post('/delete-category', blogController.checkQueryId, blogController.checkDeleteCategoryInput, blogController.isLogin, blogController.getCategoryByQueryId, blogController.handleDeleteCategory, blogController.redirectBack)

// open the port
app.listen(port, () => {
  console.log(`app listening on port ${port}!`)
})
