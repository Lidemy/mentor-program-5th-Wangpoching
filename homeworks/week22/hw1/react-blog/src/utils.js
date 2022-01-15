import moment from 'moment-timezone'

export const formatTime = (time) => {
  return moment(time).tz('Asia/Taipei').format('YYYY-MM-DD')
}

export const  getIdToken = async (auth) => {
  return await auth.currentUser.getIdToken(true)
}

export const strictFloor = (num) => {
  if (num%1 === 0) {
    return num - 1
  }
  return Math.floor(num)
}

export const scrollTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'instant',
  })
}

