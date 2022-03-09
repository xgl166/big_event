var layer = layui.layer
var form = layui.form
// 初始化富文本编辑器
initEditor()
// 1. 初始化图片裁剪器
var $image = $('#image')

// 2. 裁剪选项
var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
}

// 3. 初始化裁剪区域
$image.cropper(options)

// 获取文章分类
function initCate() {
    $.ajax({
        method: 'get',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取分类失败')
            }
            layer.msg('获取成功')
            var htmlStr = template('tpl-cate', res)
            $('[name=cate_id]').html(htmlStr)
            form.render()
        }
    })
}
initCate()

// 给选择封面的按钮绑定点击事件
$('#btnChoseImage').on('click', function () {
    $('#coverFile').click()
})
// 更换裁剪封面图片
$('#coverFile').on('change', function (e) {
    var files = e.target.files
    if (files.length === 0) {
        return
    }
    // 创建一个对应的URL地址
    var newImgURL = URL.createObjectURL(files[0])
    // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
    $image
        .cropper('destroy')    // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径  
        .cropper(options)        // 重新初始化裁剪区域

})

// 发布文章功能实现
// 需要得到第五个参数---先确定第一个 statys(状态)
// 设置state默认值是已发布
var art_state = '已发布'
// 当点击了草稿按钮把变量变为“草稿”
$("#btnSava2").on('click', function () {
    art_state = "草稿"
})
// 手机表单数据，上传服务器
$('#form-pub').on('submit', function (e) {
    e.preventDefault()
    // 创建formData对象收集数据
    var fd = new FormData($(this)[0])
    // 打印一下fd中的数据
    fd.append('state', art_state)
    $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布    
            width: 400,
            height: 280
        }).toBlob(function (blob) {
            // 将 Canvas 画布上的内容，转化为文件对象 
            // 得到文件对象后，进行后续的操作 
            fd.append('cover_img', blob)
            // fd.forEach(function (v, k) {
            //     console.log(k, v);
            //     // 此时formdata中存入的是三个参数
            //     // title cate_id content
            // })
            // 调用发布文章的函数
            pubArticle(fd)
        })

})
// 封装函数上传发布文章的数据到服务器
function pubArticle(fd) {
    $.ajax({
        method: "post",
        url: '/my/article/add',
        data: fd,
        // JQ上传文件的请求,固定写法
        processData: false,
        contentType: false,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('发布文章失败')
            }
            layer.msg('发布成功')

            location.href = "art_list.html"
        }
    })
}