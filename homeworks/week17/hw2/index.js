const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const multer = require('multer')
const adminController = require('./controllers/admin')
const userController = require('./controllers/user')
const restaurantController = require('./controllers/restaurant')

const app = express()
const port = 5005
const upload = multer({
  fileFilter(req, file, cb) {
    // 只接受三種圖片格式
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('Please upload an image'))
    }
    cb(null, true)
  }
})

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
app.use((req, res, next) => {
  res.locals.errorMessage = req.flash('errorMessage')
  next()
})
// set static resources route
app.use(express.static(path.join(__dirname, 'public')))

// handle login/register/logout/setting
app.get('/login', userController.renderLogin)
app.post('/login', userController.checkLoginInput, userController.handleLogin, userController.redirectBack)

app.get('/register', userController.renderRegister)
app.post('/register', userController.checkRegisterInput, userController.handleRegister, userController.redirectBack)

app.get('/logout', userController.handleLogout, userController.redirectBack)

// handle admin
app.get('/admin', userController.isLogin, adminController.getAllPrizes, adminController.renderAdmin)
app.post('/create', userController.isLogin, upload.single('upload'), adminController.checkCreateInput, adminController.uploadImage, adminController.uploadPrizeInformation, adminController.getAllPrizes, adminController.adjustOdds, adminController.updateOdds, adminController.redirectBack)
app.get('/delete', userController.isLogin, adminController.checkQueryId, adminController.DeletePrizeInformation, adminController.DeleteImage, adminController.getAllPrizes, adminController.adjustOdds, adminController.updateOdds, adminController.redirectBack)
app.get('/edit', userController.isLogin, adminController.checkQueryId, adminController.getPrizeByQueryId, adminController.renderEdit)
app.post('/edit', userController.isLogin, adminController.checkQueryId, upload.single('upload'), adminController.checkEditInput, adminController.getPrizeByQueryId, adminController.DeleteImage, adminController.uploadImage, adminController.updatePrizeInformation)
app.post('/edit', userController.isLogin, adminController.updatePrizeInformation)
app.post('/edit-odds', userController.isLogin, adminController.getAllPrizes, adminController.checkEditOddsInput, adminController.adjustOdds, adminController.updateOdds)

// handle main
app.get('/prize', restaurantController.renderPrize)

// handle lottery
app.get('/lottery', adminController.getAllPrizes, adminController.lottery)

// open the port
app.listen(port, () => {
  console.log(`app listening on port ${port}!`)
})
