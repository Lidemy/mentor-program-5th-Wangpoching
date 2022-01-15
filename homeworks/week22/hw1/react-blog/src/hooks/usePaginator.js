import { useState } from 'react'

export const usePaginator = (limit) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [articleAmount, setArticleAmount] = useState(0)
  let pageAmount
  if (articleAmount) {
    pageAmount = Math.ceil(articleAmount/limit)
  }

  return [currentPage, setCurrentPage, setArticleAmount, pageAmount]
}

export default usePaginator