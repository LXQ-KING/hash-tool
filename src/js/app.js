// APP标题
const packageJson = api.require('../../package.json')
document.head.querySelector('title').textContent = packageJson.description + ' v' + packageJson.version

// 头部
// 菜单
const menu = document.querySelector('.header .menu')
menu.addEventListener('click', e => {
  e.stopPropagation()
  const target = e.target
  if (target.tagName === 'P') {
    const list = target.nextElementSibling
    removeActiveMenu(list)
    list.classList.toggle('menu-active')
    initMenuList()
  } else if (target.tagName === 'DIV' && !target.classList.contains('menu')) {
    const list = target.children[1]
    removeActiveMenu(list)
    list.classList.toggle('menu-active')
    initMenuList()
  } else {
    removeActiveMenu(null)
    if (target.tagName === 'LI') {
      const context = target.textContent
      switch (context) {
        case '导入文件':
          break
        case '导入文件夹':
          break
        case '导出为...':
          break
        case '退出':
          api.operateWindow('close')
          break
        case '重新加载窗口':
          api.operateWindow('reload')
          rotateIcon()
          break
        case '最小化窗口':
          api.operateWindow('min')
          break
        case '切换全屏':
          api.operateWindow('max')
          target.textContent = '取消全屏'
          break
        case '取消全屏':
          api.operateWindow('restore')
          target.textContent = '切换全屏'
          break
        case '保持窗口在最前端':
          api.operateWindow('always-on-top', true)
          target.textContent = '取消保持窗口在最前端'
          toggleOnTop()
          break
        case '取消保持窗口在最前端':
          api.operateWindow('always-on-top', false)
          target.textContent = '保持窗口在最前端'
          toggleOnTop()
          break
        case '打开开发者工具':
          api.operateWindow('toggle-devtools', true)
          target.textContent = '取消开发者工具'
          break
        case '取消开发者工具':
          api.operateWindow('toggle-devtools', false)
          target.textContent = '打开开发者工具'
          break
        case '帮助文档':
          api.openExternalLink('https://github.com/LXQ-KING/hash-tool/blob/master/README.md')
          break
        case 'GitHub仓库':
          api.openExternalLink('https://github.com/LXQ-KING/hash-tool')
          break
        case '关于':
          break
        default:
          break
      }
    }
  }
})
// 初始化下拉菜单
function initMenuList() {
  const list = document.querySelectorAll('.menu-active')
  if (list.length > 0) {
    list[0].style.left = list[0].parentNode.offsetLeft + 'px'
    if (list[0].classList.contains('view')) {
      const windowInfo = api.window
      api.getWindowInfo().then(info => {
        list[0].children[2].textContent = info.isMaximized ?  '取消全屏' : '切换全屏'
        list[0].children[3].textContent = info.isAlwaysOnTop ? '取消保持窗口在最前端' : '保持窗口在最前端'
        list[0].children[4].textContent = info.isDevToolsOpened ? '取消开发者工具' : '打开开发者工具'
      })
    }
  }
}
// 取消已经显示的下拉菜单
function removeActiveMenu(list) {
  const active = document.querySelector('.menu-active')
  if (active && active !== list) {
    active.classList.remove('menu-active')
  }
}
// 点击页面内其他位置关闭下拉菜单
document.body.addEventListener('click', (e) => {
  removeActiveMenu(null)
})
// 点击窗口外关闭下拉菜单
api.onWindowBlur(() => {
  removeActiveMenu(null)
})
//图标
const icon = document.querySelector('.header .icon')
// 刷新
const refresh = icon.children[0]
refresh.addEventListener('click', e => {
  api.operateWindow('reload')
  rotateIcon()
})
function rotateIcon() {
  refresh.style.transform = 'rotate(360deg)'
}
// 置顶
const onTop = icon.children[1]
onTop.addEventListener('click', () => {
  api.getWindowInfo().then(info => {
    info.isAlwaysOnTop ? api.operateWindow('always-on-top', false) : api.operateWindow('always-on-top', true)
    toggleOnTop()
  })
})
function toggleOnTop() {
  api.getWindowInfo().then(info => {
    if (info.isAlwaysOnTop) {
      document.querySelector('.header .icon img:last-child').src = '../assets/images/top-on.png'
    } else {
      document.querySelector('.header .icon img:last-child').src = '../assets/images/top.png'
    }
    toggleOnTop
  })
}
toggleOnTop()