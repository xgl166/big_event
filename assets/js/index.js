getUserInfo()
function getUserInfo() {
    $.ajax({
        method: "get",
        url: '/my/userinfo',
        success: function (res) {
            console.log(res.data);
            // res.data
            if (res.status !== 0) {
                return layer.msg('认证信息失败')
            }
            // 如果成功，渲染用户头像
            renderAvatar(res.data)
        },
    });
}
function renderAvatar(data) {
    var name = data.nickname || data.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    if (data.user_pic !== null) {
        $('.layui-nav-img').prop('src', data.user_pic).show()
        $('.text_avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        $('.text_avatar').html(name[0].toUpperCase()).show()
    }
}
$('#btnLogout').on('click', function () {
    layer.confirm('确定退出登录', {
        icon: 3,
        title: '提示'
    }, function (index) {
        // 1、清除掉本地的token值
        // 2、返回登录页面
        localStorage.removeItem('token')
        location.href = "/login.html"
        layer.close(index);
    });
})