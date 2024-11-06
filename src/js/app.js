// APP标题
const packageJson = api.require('../../package.json')
document.head.querySelector('title').textContent = packageJson.description + ' v' + packageJson.version

// 头部
// 菜单
const menu = document.querySelector('.header .menu')
menu.addEventListener('click', async e => {
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
          const file = await api.selectDownloadFile('')
          if (!file.canceld) {
            // document.querySelector('.loading').style.display = 'none'
            // document.querySelector('.loading div').style.display = 'none'
          } else {
            createMessage('info', '取消导出')
          }
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
          api.openExternalLink(GITHUB_HELP_URL)
          break
        case 'GitHub仓库':
          api.openExternalLink(GITHUB_URL)
          break
        case '关于':
          document.querySelector('.about').style.display = 'block'
          document.querySelector('.about .dialog').style.display = 'block'
          const aboutValue = document.querySelector('.about ul.dialog-content')
          aboutValue.children[0].children[1].textContent = packageJson.description
          aboutValue.children[1].children[1].textContent = packageJson.version
          aboutValue.children[2].children[1].textContent = packageJson.author
          aboutValue.children[3].children[1].textContent = EMAIL
          aboutValue.children[4].children[1].textContent = GITHUB_URL
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
document.querySelector('.about .dialog-content .github').addEventListener('click', e => {
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
  operationBtn.children[0].children[2].title = '导出所有文件哈希值详情到指定文件'
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
    createMessage('info', '取消选择文件')
  } else {
    addFiles(result.files)
  }
})
document.querySelector('.content .selector .directory').addEventListener('click', async () => {
  const result = await api.selectFolder()
  if (result.canceld) {
    createMessage('info', '取消选择文件夹')
  } else {
    addFiles(result.files)
  }
})
document.querySelector('.content .selector .export').addEventListener('click', async () => {
  const file = await api.selectDownloadFile('')
  if (!file.canceld) {
    // document.querySelector('.loading').style.display = 'none'
    // document.querySelector('.loading div').style.display = 'none'
  } else {
    createMessage('info', '取消导出全部文件')
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
  let fileExists = true
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
    fileExists = false
    return file
  })
  files.push(...fileList)
  document.querySelector('.content .operation .selector .export').style.display = 'inline-block'
  document.querySelector('.loading').style.display = 'none'
  document.querySelector('.loading div').style.display = 'none'
  if (fileExists) {
    createMessage('warn', '文件已存在，请勿重复导入')
  } else {
    createMessage('right', '导入成功')
  }
}
function getFilePaths(fileList) {
  return fileList.map(file => file.filePath)
}
// 点击文件列表操作按钮
document.querySelector('.content .file-list .files').addEventListener('click', async e => {
  const target = e.target
  if (target.classList.contains('btn')) {
    const content = target.textContent
    const fileLine = target.parentNode.parentNode
    switch (content) {
      case '检验':
        document.querySelector('.check .hash-value .origin textarea').value = target.parentNode.previousElementSibling.textContent
        document.querySelector('.check .message').textContent = ''
        if (!target.parentNode.previousElementSibling.textContent) {
          createMessage('warn', '未计算文件哈希值')
        } else {
          createMessage('right', '已将Hash值复制到原始哈希值区域')
        }
        break
      case '复制':
        navigator.clipboard.writeText(target.parentNode.previousElementSibling.textContent).then(() => {
          if (!target.parentNode.previousElementSibling.textContent) {
            createMessage('warn', '未计算文件哈希值')
          } else {
            createMessage('right', '复制成功')
          }
        }).catch(error => {
          createMessage('error', '复制失败')
        })
        break
      case '详情':
        document.querySelector('.detail').style.display = 'block'
        document.querySelector('.detail .dialog').style.display = 'block'
        const detailValue = document.querySelector('.detail ul.dialog-content')
        detailValue.children[0].children[1].textContent = fileLine.children[0].textContent
        detailValue.children[1].children[1].textContent = fileLine.children[1].textContent
        if (fileLine.children[2].textContent) {
          detailValue.children[2].children[1].textContent = document.querySelector('.content .file-list .title span').textContent.replace('（', '').replace('）', '')
          detailValue.children[2].children[1].style.color = '#000'
          detailValue.children[3].children[1].textContent = fileLine.children[2].textContent
          detailValue.children[3].children[1].style.color = '#000'
        } else {
          detailValue.children[2].children[1].textContent = '无'
          detailValue.children[2].children[1].style.color = 'red'
          detailValue.children[3].children[1].textContent = '未计算'
          detailValue.children[3].children[1].style.color = 'red'
        }
        break
      case '导出':
        const filePath = fileLine.children[0].textContent
        const file = await api.selectDownloadFile(fileLine.children[0].textContent)
        if (!file.canceld) {
          // document.querySelector('.loading').style.display = 'none'
          // document.querySelector('.loading div').style.display = 'none'
        } else {
          createMessage('info', '取消导出所选文件')
        }
        break
      default:
        break
    }
  }
})
// 文件哈希值详情弹窗
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
// 导出文件哈希值详情
api.onDownloadFile((filePath, downFile) => {
  const fileLines = document.querySelectorAll('.content .file-list .files .line')
  let result = ''
  let all = ''
  const algorithm = document.querySelector('.content .file-list .title span').textContent.replace('（', '').replace('）', '')
  fileLines.forEach(line => {
    if (line.children[2].textContent) {
      all += `文件路径：${line.children[0].textContent}\n文件名：${line.children[1].textContent}\n哈希算法：${algorithm}\n哈希值：${line.children[2].textContent}\n\n`
    } else {
      all += `文件路径：${line.children[0].textContent}\n文件名：${line.children[1].textContent}\n哈希算法：无\n哈希值：未计算\n\n`
    }
    if (line.children[0].textContent === downFile) {
      if (line.children[2].textContent) {
        result = `文件路径：${line.children[0].textContent}\n文件名：${line.children[1].textContent}\n哈希算法：${algorithm}\n哈希值：${line.children[2].textContent}`
      } else {
        result = `文件路径：${line.children[0].textContent}\n文件名：${line.children[1].textContent}\n哈希算法：无\n哈希值：未计算`
      }
    }
  })
  if (downFile) {
    result = downFile === 'all' ? all : result
  }
  if (fileLines.length > 0) {
    api.sendDownloadContent(filePath, result)
  } else {
    document.querySelector('.loading').style.display = 'none'
    document.querySelector('.loading div').style.display = 'none'
    createMessage('warn', '没有可导出的文件')
  }
})
api.onDownloadResponse(idDownloaded => {
  if (idDownloaded) {
    createMessage('right', '导出成功')
  } else {
    createMessage('error', '导出失败')
  }
  document.querySelector('.loading').style.display = 'none'
  document.querySelector('.loading div').style.display = 'none'
})
// 清空文件列表
document.querySelector('.content .operation .reset').addEventListener('click', () => {
  document.querySelector('.content .file-list .files').innerHTML = ''
  document.querySelector('.content .file-list .title span').textContent = ''
  document.querySelector('.content .operation .selector .export').style.display = 'none'
  if (files.length > 0) {
    files.length = 0
    createMessage('right', '重置成功')
  } else {
    createMessage('warn', '没有可清空的文件')
  }
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
  if (files.length > 0) {
    createMessage('right', 'Hash值计算成功')
  } else {
    createMessage('warn', '还未导入文件，没有可计算的Hash值')
  }
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
  if (origin === '' && target === '') {
    createMessage('warn', '原始哈希值和目标哈希值不能为空')
    return
  } else if (origin === '') {
    createMessage('warn', '原始哈希值不能为空')
    return
  } else if (target === '') {
    createMessage('warn', '目标哈希值不能为空')
    return
  }
  if (origin.trim() === target.trim()) {
    message.style.color = 'green'
    message.textContent = '哈希值相同'
    createMessage('right', '比较成功，哈希值相同')
  } else {
    message.style.color = 'red'
    message.textContent = '哈希值不同'
    createMessage('error', '比较失败，哈希值不同')
  }
})
document.querySelector('.check .hash-value .origin textarea').addEventListener('input', e => {
  document.querySelector('.check .message').textContent = ''
})
document.querySelector('.check .hash-value .target textarea').addEventListener('input', e => {
  document.querySelector('.check .message').textContent = ''
})

// 底部栏
document.querySelector('.footer div').textContent = EMAIL