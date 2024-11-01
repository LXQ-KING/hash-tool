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

// 内容区
const content = document.querySelector('.content')
function initFileTextarea() {
  // 初始化操作区
  const operationBtn = content.children[0]
  operationBtn.children[0].children[0].title = '追加所选文件'
  operationBtn.children[0].children[1].title = '追加所选文件夹内所有文件'
  operationBtn.children[1].title = '清空文件列表'
  // 初始化文件列表
  const fileTextarea = content.children[1]
  const fileList = fileTextarea.children[1]
  if (fileList.children.length > 0) {
    fileList.style['margin-top'] = fileTextarea.children[0].offsetHeight + 'px'
    fileList.children[0].title = fileList.children[0].textContent
    fileList.children[1].title = fileList.children[1].textContent
    fileList.children[2].title = fileList.children[2].textContent
    const actionBtn = fileList.children[3]
    actionBtn.children[0].title = '将文件哈希值作为原始哈希值'
    actionBtn.children[1].title = '复制文件哈希值'
    actionBtn.children[2].title = '查看文件哈希值详情'
    actionBtn.children[3].title = '导出文件哈希值详情到指定文件'
  }
  // 初始化加密按钮
  const encryptBtn = content.children[2]
  encryptBtn.children[1].title = '计算所有文件对应的哈希值'
}
initFileTextarea()

// 检验区
const check = document.querySelector('.check')
function initCheckArea() {
  // 初始化中间区域
  const hashTextarea = check.children[0]
  hashTextarea.children[1].style['margin-top'] = hashTextarea.children[0].children[1].offsetTop + 'px'
  hashTextarea.querySelector('.pk').title = '比较原始哈希值和目标哈希值'
}
initCheckArea()