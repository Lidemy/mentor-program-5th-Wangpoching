const request = require('request')
const db = require('../models')
/* eslint-disable */
const imgurInfo = require('../resource/imgur-info.js')
/* eslint-enable */

const { Prize } = db
const { USERNAME, ACCESSTOKEN, ALBUMID } = imgurInfo

function totalSumEqualOne(sortedArr) {
  let result = []
  let totalSum = 0
  let lastTotalSum = 0
  let adjust = 0
  let index = 0
  for (const num of sortedArr) {
    totalSum += num
    if (totalSum >= 1) {
      adjust = 1 - lastTotalSum
      break
    }
    lastTotalSum = totalSum
    index++
  }
  // 總和小於 1 ，大的補上
  if (totalSum < 1) {
    result = sortedArr
    result[0] += 1 - totalSum
    return result
  }
  // 總和超過 1 ，小的變為 0
  result = sortedArr.map((ele, i) => {
    if (i < index) return ele
    if (i === index) return adjust
    return 0
  })
  return result
}

const adminController = {
  renderEdit: (req, res, next) => {
    const { prize } = req
    res.render('edit', {
      prize
    })
  },

  renderAdmin: (req, res, next) => {
    const { prizes } = req
    res.render('admin', {
      prizes,
      isLogin: true
    })
  },

  checkCreateInput: (req, res, next) => {
    const { name, desc, probability } = req.body
    if (!name || !desc || !probability || !req.file) {
      req.flash('errorMessage', '資料不齊全')
      return res.redirect('back')
    }
    next()
  },

  checkEditOddsInput: (req, res, next) => {
    for (const prize of req.prizes) {
      if (!(prize.id in req.body)) {
        return res.redirect('/admin')
      }
      prize.probability = req.body[prize.id]
    }
    next()
  },

  checkEditInput: (req, res, next) => {
    const { name, desc } = req.body
    if (!name || !desc) {
      req.flash('errorMessage', '資料不齊全')
      return res.redirect('back')
    }
    if (!req.file) {
      return next('route')
    }
    next()
  },

  checkQueryId: (req, res, next) => {
    const { id } = req.query
    if (!id) {
      return res.redirect('back')
    }
    next()
  },

  getAllPrizes: (req, res, next) => {
    Prize.findAll().then((prizes) => {
      req.prizes = prizes
      next()
    }).catch((err) =>
      res.redirect('back')
    )
  },

  uploadImage: (req, res, next) => {
    request.post(
      {
        url: 'https://api.imgur.com/3/image',
        headers: {
          Authorization: `Bearer ${ACCESSTOKEN}`
        },
        formData: {
          image: req.file.buffer,
          album: ALBUMID
        }
      },
      (error, response, body) => {
        let parsedBody
        try {
          parsedBody = JSON.parse(body)
        } catch (err) {
          req.flash('errorMessage', '上傳失敗')
          return res.redirect('back')
        }
        if (parsedBody.success) {
          const { data } = parsedBody
          req.deleteHash = data.deletehash
          req.imageUrl = data.link
          return next()
        }
        req.flash('errorMessage', '上傳失敗')
        return res.redirect('back')
      }
    )
  },

  uploadPrizeInformation: (req, res, next) => {
    const { name, desc, probability } = req.body
    const { deleteHash, imageUrl } = req
    Prize.create({
      name,
      desc,
      probability,
      deleteHash,
      imageUrl
    }).then(() =>
      next()
    ).catch((err) => {
      req.flash('errorMessage', '上傳失敗')
      return res.redirect('back')
    })
  },

  updatePrizeInformation: (req, res, next) => {
    const { name, desc, probability } = req.body
    const { deleteHash, imageUrl } = req
    Prize.update({
      name,
      desc,
      probability,
      deleteHash,
      imageUrl
    }, {
      where: {
        id: req.query.id
      }
    }).then(() =>
      res.redirect('admin')
    ).catch((err) => {
      req.flash('errorMessage', '上傳失敗')
      return res.redirect('back')
    })
  },

  DeletePrizeInformation: (req, res, next) => {
    const { id } = req.query
    Prize.findOne({
      where: {
        id
      }
    }).then((prize) => {
      req.deleteHash = prize.deleteHash
      Prize.destroy({
        where: {
          id
        }
      }).then((result) => {
        if (!result) {
          return res.redirect('back')
        }
        return next()
      }).catch((err) =>
        res.redirect('back')
      )
    }).catch((err) =>
      res.redirect('back')
    )
  },

  DeleteImage: (req, res, next) => {
    const { deleteHash } = req
    request.delete(
      {
        url: `https://api.imgur.com/3/account/${USERNAME}/image/${deleteHash}`,
        headers: {
          Authorization: `Bearer ${ACCESSTOKEN}`
        }
      },
      (error, response, body) => {
        let parsedBody
        try {
          parsedBody = JSON.parse(body)
        } catch (err) {
          return res.redirect('back')
        }
        if (parsedBody.success) {
          return next()
        }
      }
    )
  },

  getPrizeByQueryId: (req, res, next) => {
    const { id } = req.query
    Prize.findOne({
      where: {
        id
      }
    }).then((prize) => {
      req.prize = prize
      req.deleteHash = prize.deleteHah
      return next()
    }).catch((err) =>
      res.redirect('back')
    )
  },

  adjustOdds: (req, res, next) => {
    const { prizes } = req
    // 排序
    const odds = {}
    for (const prize of prizes) {
      odds[prize.id] = prize.probability
    }
    const sortable = []
    for (const id in odds) {
      sortable.push([id, odds[id]])
    }
    sortable.sort((a, b) =>
      b[1] - a[1]
    )
    const sortedOdds = sortable.map((ele) => Number(ele[1]))
    const adjustOdds = totalSumEqualOne(sortedOdds)
    sortable.forEach((ele, i) => {
      ele[1] = adjustOdds[i]
    })
    req.adjustOdds = sortable
    next()
  },

  updateOdds: async(req, res, next) => {
    const { adjustOdds } = req
    const ids = adjustOdds.map((ele) => ele[0])
    const odds = adjustOdds.map((ele) => ele[1])
    const results = []
    for (const i in ids) {
      results.push(
        Prize.update(
          {
            probability: odds[i]
          },
          {
            where: {
              id: ids[i]
            }
          }
        )
      )
    }
    await Promise.all(results)
    return res.redirect('/admin')
  },

  lottery: (req, res, next) => {
    const { prizes } = req
    let pool = []
    prizes.forEach((prize) => {
      pool = pool.concat(Array(Math.floor(prize.probability * 100)).fill(prize.id))
    })
    const randomElement = Number(pool[Math.floor(Math.random() * pool.length)])
    Prize.findOne({
      where: {
        id: randomElement
      }
    }).then((prize) => {
      res.header('Access-Control-Allow-Origin', '*')
      const { name, desc, imageUrl } = prize
      return res.json({
        success: true,
        prize: {
          name,
          desc,
          imageUrl
        }
      })
    }).catch((err) =>
      res.json({ success: false })
    )
  },

  redirectBack: (req, res, next) => {
    if (req.headers.referer) {
      return res.redirect('back')
    }
    return res.redirect('/admin')
  }
}

module.exports = adminController
