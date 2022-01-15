const Sequelize = require('sequelize')
const { customAlphabet } = require('nanoid')
const db = require('../models')

const { Op } = Sequelize
const { Article, User } = db
const nanoid = customAlphabet('1234567890', 6)

const ArticleController = {
  getAllArticles: async(req, res, next) => {
    let { limit, page } = req.query
    const { word } = req.query
    limit = Number(limit)
    page = Number(page)
    try {
      const articles = await Article.findAll({
        order: [['createdAt', 'DESC']],
        ...(word && {
          where: {
            [Op.or]: [
              { title: { [Op.like]: `%${req.query.word}%` } },
              { plainContent: { [Op.like]: `%${req.query.word}%` } }
            ]
          }
        }),
        ...(limit && page && {
          limit,
          offset: (page - 1) * limit
        }),
        include: User
      })
      const data = articles.map((article) => {
        const { id, title, content, plainContent, createdAt } = article
        const { name } = article.User
        return {
          id,
          name,
          authorUid: article.User.id,
          title,
          content,
          plainContent,
          createdAt
        }
      })
      const articleAmount = req.query.word
        ? await Article.count({
          where: {
            [Op.or]: [
              { title: { [Op.like]: `%${req.query.word}%` } },
              { plainContent: { [Op.like]: `%${req.query.word}%` } }
            ]
          }
        })
        : await Article.count()

      return res.set('article-amount', articleAmount)
        .set('Access-Control-Expose-Headers', 'article-amount')
        .status(200)
        .json({
          success: true,
          data
        })
    } catch (err) {
      console.log(err)
      return res.status(400).json({
        success: false,
        errorMessage: ['系統錯誤']
      })
    }
  },

  getArticle: async(req, res, next) => {
    if (!req.query.id) {
      return res.status(400).json({
        success: false,
        errorMessage: ['請攜帶 query string']
      })
    }
    let article
    try {
      article = await Article.findOne({
        where: {
          id: Number(req.query.id)
        },
        include: User
      })
      if (!article) {
        return res.status(400).json({
          success: false,
          errorMessage: ['找不到文章']
        })
      }
      const { id, title, content, plainContent, createdAt } = article
      const { name } = article.User
      const data = {
        id,
        name,
        authorUid: article.User.id,
        title,
        content,
        plainContent,
        createdAt
      }
      return res.status(200).json({
        success: true,
        data
      })
    } catch (err) {
      console.log(err)
      return res.status(400).json({
        success: false,
        errorMessage: ['系統錯誤']
      })
    }
  },

  editArticle: async(req, res, next) => {
    const { userId } = req
    const { id, title, content, plainContent } = req.body
    try {
      const article = await Article.findOne({
        where: {
          id,
          userId
        }
      })
      if (!article) {
        return res.status(400).json({
          success: false,
          errorMessage: ['找不到文章']
        })
      }
      await article.update({
        title,
        content,
        plainContent
      })
      return res.status(200).json({
        success: true
      })
    } catch (err) {
      return res.status(400).json({
        success: false,
        errorMessage: ['系統錯誤']
      })
    }
  },

  writeArticle: async(req, res, next) => {
    const csrfToken = nanoid(8)
    const { userId } = req
    const { title, content, plainContent } = req.body
    try {
      await Article.create({
        userId,
        title,
        content,
        plainContent,
        csrfToken
      })
      return res.status(200).json({
        success: true
      })
    } catch (err) {
      console.log(err)
      return res.status(400).json({
        success: false,
        errorMessage: ['系統錯誤']
      })
    }
  },

  getCsrfToken: async(req, res, next) => {
    const { userId } = req
    const { id } = req.query
    try {
      const result = await Article.findOne({
        attributes: ['csrfToken'],
        where: {
          id,
          userId
        }
      })
      if (!result) {
        return res.status(400).json({
          success: false,
          errorMessage: ['找不到文章']
        })
      }
      const { csrfToken } = result
      return res.status(200).json({
        success: true,
        data: {
          csrfToken
        }
      })
    } catch (err) {
      return res.status(400).json({
        success: false,
        errorMessage: ['系統錯誤']
      })
    }
  },

  deleteArticle: async(req, res, next) => {
    const { userId } = req
    const { id, csrfToken } = req.body
    try {
      const article = await Article.findOne({
        where: {
          id,
          userId,
          csrfToken
        }
      })
      if (!article) {
        return res.status(400).json({
          success: false,
          errorMessage: ['找不到文章']
        })
      }
      const result = await article.destroy()
      if (!result) {
        return res.status(400).json({
          success: false,
          errorMessage: ['刪除文章失敗']
        })
      }
      return res.status(200).json({
        success: true
      })
    } catch (err) {
      return res.status(400).json({
        success: false,
        errorMessage: ['系統錯誤']
      })
    }
  }
}

module.exports = ArticleController
