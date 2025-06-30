import Cookies from 'js-cookie'

const defaultKEY = 'Admin-Token'

export function getToken(TokenKey = defaultKEY) {
  return Cookies.get(TokenKey)
}

export function setToken(token, TokenKey = defaultKEY) {

  return Cookies.set(TokenKey, token)
}

export function removeToken(TokenKey = defaultKEY) {
  return Cookies.remove(TokenKey)
}
