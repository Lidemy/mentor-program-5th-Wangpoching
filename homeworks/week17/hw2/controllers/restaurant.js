const restaurantController = {
  renderPrize: (req, res, next) => {
    if (req.session.username) {
      return res.render('prize', {
        isLogin: true
      })
    }
    return res.render('prize', {
      isLogin: false
    })
  }
}

module.exports = restaurantController
