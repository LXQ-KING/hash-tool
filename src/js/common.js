// 消息提示框
function createMessage(type, message) {
  const messageBox = document.querySelector('.messageBox')
  if (messageBox) document.body.removeChild(messageBox)
  const div = document.createElement('div')
  div.classList.add('messageBox')
  div.classList.add(type)
  div.style.animation = 'popup 0.5s ease 2 alternate forwards'
  div.innerHTML = `
    <div><img src="../assets/images/${type}.png" alt="${type}"></div>
    <div>${message}</div>
  `
  document.body.insertBefore(div, document.body.querySelector('script'))
}
function closeMessage(type, message) {
  const messageBox = document.querySelector('.message-box')
  if (messageBox) {
    document.body.removeChild(messageBox)
  }
}