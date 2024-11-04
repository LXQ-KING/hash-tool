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
          document.querySelector('.content .selector .file').click()
          break
        case '导入文件夹':
          document.querySelector('.content .selector .directory').click()
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
          document.querySelector('.about').style.display = 'block'
          document.querySelector('.about .dialog').style.display = 'block'
          const aboutValue = document.querySelector('.about .dialog-content ul:last-child')
          aboutValue.children[0].textContent = packageJson.description
          aboutValue.children[1].textContent = packageJson.version
          aboutValue.children[2].textContent = packageJson.author
          // about.querySelector('.dialog-content ul:first-child').style.width = getComputedStyle(about.querySelector('.dialog-content ul:last-child')).width
          break
        default:
          break
      }
    }
  }
})
document.querySelector('.about').addEventListener('click', e => {
  if (e.target.classList.contains('about')) {
    document.querySelector('.about').style.display = 'none'
    document.querySelector('.about .dialog').style.display = 'none'
  }
})
document.querySelector('.about .close').addEventListener('click', e => {
  if (e.target.tagName === 'IMG') {
    e.target.parentNode.parentNode.style.display = 'none'
    e.target.parentNode.parentNode.parentNode.style.display = 'none'
  }
})
document.querySelector('.about .dialog-content .github').addEventListener('click', () => {
  api.openExternalLink(e.target.textContent)
})
// 初始化下拉菜单
function initMenuList() {
  const list = document.querySelectorAll('.menu-active')
  if (list.length > 0) {
    list[0].style.left = list[0].parentNode.offsetLeft + 'px'
    if (list[0].classList.contains('view')) {
      const windowInfo = api.window
      api.getWindowInfo().then(info => {
        list[0].children[2].textContent = info.isMaximized ? '取消全屏' : '切换全屏'
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
  // 初始化加密按钮
  const encryptBtn = content.children[2]
  encryptBtn.children[1].title = '计算所有文件对应的哈希值'
}
initFileTextarea()
// 导入文件
const files = []
document.querySelector('.content .selector .file').addEventListener('click', async () => {
  const result = await api.selectFile()
  if (result.canceld) {
    console.log('取消选择文件')
  } else {
    addFiles(result.files)
  }
})
document.querySelector('.content .selector .directory').addEventListener('click', async () => {
  const result = await api.selectFolder()
  if (result.canceld) {
    console.log('取消选择文件夹')
  } else {
    addFiles(result.files)
  }
})
api.onToggleLoading(show => {
  const loading = document.querySelector('.loading')
  const loadingIcon = document.querySelector('.loading div')
  if (show) {
    loading.style.display = 'block'
    loadingIcon.style.display = 'block'
  } else {
    loading.style.display = 'none'
    loadingIcon.style.display = 'none'
  }
})
// 追加文件
function addFiles(selectedFiles) {
  const filePaths = getFilePaths(files)
  const fileList = selectedFiles.filter(file => {
    if (filePaths.includes(file.filePath)) return false
    const div = document.createElement('div')
    div.classList.add('line')
    div.innerHTML = `
    <div class="path" title="${file.filePath}">${file.filePath}</div>
    <div class="name" title="${file.fileName}">${file.fileName} </div>
    <div class="hash"></div>
    <div class="actions">
      <div class="btn" title="将文件哈希值作为原始哈希值">检验</div>
      <div class="btn" title="复制文件哈希值">复制</div>
      <div class="btn" title="查看文件哈希值详情">详情</div>
      <div class="btn" title="导出文件哈希值详情到指定文件">导出</div>
    </div>
    `
    document.querySelector('.content .file-list .files').appendChild(div)
    return file
  })
  files.push(...fileList)
  document.querySelector('.loading').style.display = 'none'
  document.querySelector('.loading div').style.display = 'none'
}
function getFilePaths(fileList) {
  return fileList.map(file => file.filePath)
}
// 点击文件列表操作按钮
document.querySelector('.content .file-list .files').addEventListener('click', e => {
  const target = e.target
  if (target.classList.contains('btn')) {
    const content = target.textContent
    switch (content) {
      case '检验':
        document.querySelector('.check .hash-value .origin textarea').value = target.parentNode.previousElementSibling.textContent
        document.querySelector('.check .message').textContent = ''
        break
      case '复制':
        navigator.clipboard.writeText(target.parentNode.previousElementSibling.textContent).then(() => {
          console.log('复制成功')
        }).catch(error => {
          console.log('复制失败', error.message)
        })
        break
      case '详情':
        document.querySelector('.detail').style.display = 'block'
        document.querySelector('.detail .dialog').style.display = 'block'
        const dialogContent = document.querySelector('.detail .dialog-content ul:last-child')
        break
      case '导出':
        break
      default:
        break
    }
  }
})
document.querySelector('.detail').addEventListener('click', e => {
  if (e.target.classList.contains('detail')) {
    document.querySelector('.detail').style.display = 'none'
    document.querySelector('.detail .dialog').style.display = 'none'
  }
})
document.querySelector('.detail .close').addEventListener('click', e => {
  if (e.target.tagName === 'IMG') {
    e.target.parentNode.parentNode.style.display = 'none'
    e.target.parentNode.parentNode.parentNode.style.display = 'none'
  }
})
// 清空文件列表
document.querySelector('.content .operation .reset').addEventListener('click', () => {
  document.querySelector('.content .file-list .files').innerHTML = ''
  files.length = 0
  document.querySelector('.content .file-list .title span').textContent = ''
})
// 计算哈希值
document.querySelector('.content .encrypt .btn').addEventListener('click', () => {
  const loading = document.querySelector('.content .encrypt .btn img')
  loading.style.display = 'inline'
  loading.style.animation = 'loading 1s linear infinite'
  const algorithm = document.querySelector('.content .encrypt .algorithm select').value
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const hash = api.calculateHash(algorithm, file.content)
    const fileElement = document.querySelector(`.content .file-list .files .line:nth-child(${i + 1})`)
    const hashElement = fileElement.querySelector('.hash')
    hashElement.textContent = hash
    hashElement.title = hash
    document.querySelector('.content .file-list .title span').textContent = `（${algorithm}）`
  }
  loading.style.display = 'none'
})

// 检验区
const check = document.querySelector('.check')
function initCheckArea() {
  // 初始化中间区域
  const hashTextarea = check.children[0]
  hashTextarea.children[1].style['margin-top'] = hashTextarea.children[0].children[1].offsetTop + 'px'
  hashTextarea.querySelector('.pk').title = '比较原始哈希值和目标哈希值'
}
initCheckArea()
// 哈希值比较
document.querySelector('.check .hash-value .compare .pk').addEventListener('click', () => {
  const message = document.querySelector('.check .message')
  const origin = document.querySelector('.check .hash-value .origin textarea').value
  const target = document.querySelector('.check .hash-value .target textarea').value
  if (origin === '' || target === '') return
  if (origin === target) {
    message.style.color = 'green'
    message.textContent = '哈希值相同'
  } else {
    message.style.color = 'red'
    message.textContent = '哈希值不同'
  }
})
document.querySelector('.check .hash-value .origin textarea').addEventListener('input', e => {
  document.querySelector('.check .message').textContent = ''
})
document.querySelector('.check .hash-value .target textarea').addEventListener('input', e => {
  document.querySelector('.check .message').textContent = ''
})