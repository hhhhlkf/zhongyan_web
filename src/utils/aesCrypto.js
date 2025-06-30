/*
 * @Author: tzq
 * @Date: 2024-01-03 15:21:31
 * @LastEditors: tzq
 * @LastEditTime: 2024-01-03 16:00:41
 * @FilePath: \bdcar-net\src\utils\crypto.js
 * @Description: 
 * Copyright (c) 2024 by tzq/exsun, All Rights Reserved. 
 */
import CryptoJS from 'crypto-js';

//AES对称加密-加密方法
export function encryptByAES(word, keyStr = AESkey) {
  // 默认的 KEY 与 iv 如果没有给
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  const iv = CryptoJS.enc.Utf8.parse('')
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.ciphertext.toString().toUpperCase();
}
// return cipherChunks.join('').toLowerCase();

//AES对称加密-解密方法
export function decryptByAES(word, keyStr = AESkey) {
  // 先转小写再转wordArray
  const _wordArray = CryptoJS.enc.Hex.parse(word.toLowerCase());

  // 从Hex转base64
  const base64str = CryptoJS.enc.Base64.stringify(_wordArray);
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  const iv = CryptoJS.enc.Utf8.parse('')
  const decrypted = CryptoJS.AES.decrypt(base64str, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

// export const AESkey = "74486973696464644559313235363864"//key必须为16字节utf8字符（如英文字母、数字等等）
const AESkey = "tHisidddEY12568d"//原始密钥,上面为转为16进制后的