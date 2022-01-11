const BASE_URL = 'https://react-blog.bocyun.tw/v1'

export const thirdPartyRegister = async (IdToken) => {
  return await fetch(`${BASE_URL}/register`, {
    headers: {
      'authorization': `Bearer ${IdToken}`
    }
  })
}

export const normalRegister = async (IdToken, name) => {
  return await fetch(`${BASE_URL}/register?type=password&name=${name}`, {
    headers: {
      Authorization: `Bearer ${IdToken}`
    }
  })
}

export const getArticles = async (page, limit, word) => {
  if (word) {
    return await fetch(`${BASE_URL}/articles?page=${page}&limit=${limit}&word=${word}`)    
  }
  return await fetch(`${BASE_URL}/articles?page=${page}&limit=${limit}`)
}

export const getArticle = async (id) => {
  return await fetch(`https://react-blog.bocyun.tw/v1/article?id=${id}`)
}

export const saveArticle = async (IdToken, id, title, contentToSave, plainContent, isEdit) => {
  return await fetch(`${BASE_URL}/article`, {
    method: isEdit ? 'PUT' : 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${IdToken}`,
    },
    body: JSON.stringify({
      id,
      title,
      content: contentToSave,
      plainContent
    })
  })
}

export const deleteArticle = async (IdToken, id, csrfToken) => {
  return await fetch(`${BASE_URL}/article`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${IdToken}`
    },
    body: JSON.stringify({
      id,
      csrfToken
    }) 
  })
}

export const getCsrfToken = async (IdToken, id) => {
  return await fetch(`${BASE_URL}/csrf?id=${id}`, {
    headers: {
      Authorization: `Bearer ${IdToken}`
    },      
  })
}

export const getMe = async (IdToken) => {
  return await fetch(`${BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${IdToken}`
    }
  })
}

export const editMe = async (IdToken, description) => {
  return await fetch(`${BASE_URL}/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${IdToken}`
    },
    body: JSON.stringify({
      description
    })
  })
}