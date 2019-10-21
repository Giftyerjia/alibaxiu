$('#logout').on('click',function(){
    var isConfirm = confirm('您真的要退出吗?');
    if (isConfirm) {
      // alert('用户点击了确认按钮')
      $.ajax({
        type: 'post',
        url: '/logout',
        success: function () {
          location.href = 'login.html';
        },
        error: function () {
          alert('退出失败')
        }
      })
    }
  });

// 当管理员选择logo图片时
$('#logo').on('change', function() {
    // 获取到管理员选择的图片
    var file = this.files[0];
    // 创建formData对象 实现二进制文件上传
    var formData =  new FormData();
    // 将管理员选择到的文件添加到formData对象中
    formData.append('logo', file);
    // 向服务器端发送请求 实现文件上传
    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log(response);
            $('#hiddenLogo').val();
        }
    })
})

// 当网站设置表单发生提交行为时
$('#settingsForm').on('submit', function() {
    // 获取管理员在表单中输入的内容
    var formData = $(this).serialize();
    // 向服务器端发送请求 实现网站设置数据添加功能
    $.ajax({
        type: 'post',
        url: '/settings',
        data: formData,
        success: function() {
            location.reload();
        }
    })
    return false;
})