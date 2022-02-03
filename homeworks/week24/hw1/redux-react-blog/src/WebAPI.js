import qs from 'qs'

const BASE_URL = 'https://react-blog.bocyun.tw/v1'

export const thirdPartyRegister = async (idToken) => {
  return await fetch(`${BASE_URL}/register`, {
    headers: {
      'authorization': `Bearer ${idToken}`
    }
  })
}

export const normalRegister = async (idToken, name) => {
  const queryString = {
    type: 'password',
    name
  }
  return await fetch(`${BASE_URL}/register?${qs.stringify(queryString)}`, {
    headers: {
      Authorization: `Bearer ${idToken}`
    }
  })
}

export const getArticles = async (page, limit, word) => {
  const queryString = {
    page,
    limit,
    ...(word && {word})
  }
  return await fetch(`${BASE_URL}/articles?${qs.stringify(queryString)}`)
}

export const getArticle = async (id) => {
  const queryString = {
    id
  }
  return await fetch(`${BASE_URL}/article?${qs.stringify(queryString)}`)
}

export const saveArticle = async (idToken, id, title, contentToSave, plainContent, isEdit) => {
  return await fetch(`${BASE_URL}/article`, {
    method: isEdit ? 'PUT' : 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      id,
      title,
      content: contentToSave,
      plainContent
    })
  })
}

const getCsrfToken = async (idToken, id) => {
  const queryString = {
    id
  }
  const res = await fetch(`${BASE_URL}/csrf?${qs.stringify(queryString)}`, {
    headers: {
      Authorization: `Bearer ${idToken}`
    },      
  })
  if (!res.ok) {
    throw new Error('get csrfToken failed')
  }
  const body = await res.json()
  return body.data.csrfToken
}

export const deleteArticle = async (idToken, id) => {
  const csrfToken = await getCsrfToken(idToken, id)
  return await fetch(`${BASE_URL}/article`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    },
    body: JSON.stringify({
      id,
      csrfToken
    }) 
  })
}

export const getMe = async (idToken) => {
  return await fetch(`${BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${idToken}`
    }
  })
}

export const editMe = async (idToken, description) => {
  return await fetch(`${BASE_URL}/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    },
    body: JSON.stringify({
      description
    })
  })
}