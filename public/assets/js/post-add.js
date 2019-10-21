// 向服务器端发送请求 获取文章分类数据
$.ajax({
    url: '/categories',
    type: 'get',
    success: function(response) {
        // console.log(response)
        var html = template('categoryTpl', { data: response });
        $('#category').html(html);
    }
})

// 当管理员选择文件的时候 触发事件
$('#feature').on('change', function() {
    // 获取到管理员选择到的文件
    var file = this.files[0];
    // 创建formData对象 实现二进制文件上传
    var formData = new FormData();
    // 将管理员选择到的文件追加到formData对象中
    formData.append('cover', file);
    // 实现文章封面图片上传
    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        // 告诉$.ajax方法不要处理data属性对应的参数
        processData: false,
        // 告诉$.ajax方法不要设置参数类型
        contentType: false,
        success: function(response) {
            // console.log(response)
            $('#thumbnail').val(response[0].cover);
        }
    })
});

// 当添加文章表单提交的时候
$('#addForm').on('submit', function() {
    // 获取管理员在表单中输入的内容
    var formData = $(this).serialize();
    // 向服务器端发送请求 实现添加文章功能
    $.ajax({
            type: 'post',
            url: '/posts',
            data: formData,
            success: function() {
                // 文章添加成功 跳转到文章列表页面
                location.href = '/admin/posts.html'
            }
        })
        // 阻止表单默认提交的行为
    return false;
});

console.log(getUrlParams('id'));

// 从浏览器的地址栏中获取参数
function getUrlParams(name) {
    var paramsAry = location.search.substr(1).split('&');
    // 循环数据
    for (var i = 0; i < paramsAry.length; i++) {
        var tmp = paramsAry[i].split('=');
        if(tmp[0] == name) {
            return tmp[1];
        }
    }
    return -1;
}

var id = getUrlParams('id');

    if (id != -1) {
      // 编辑功能 根据传递过来的id去请求服务器将这篇文章的所有数据查询
      $.ajax({
        type: 'get',
        url: '/posts/' + id,
        success: function (response) {
          // console.log(response);
          $('#title').val(response.title);
          $('#content').val(response.content);
          $('h1').text('编辑文章');
          // 预览图片
          $('#prev').show().attr('src', response.thumbnail);
          $('#img').val(response.thumbnail);

          // 将对应的分类显示出来 
          $('#category > option').each((index, item) => {
            // 判断option里面的value属性的值与response.category的值是否相等 如果相等 就表示是这个分类 给其设置一个selected 
            if ($(item).attr('value') == response.category) {
              $(item).prop('selected', true);
            }
          });


          $('#status > option').each((index, item) => {
            // 判断option里面的value属性的值与response.category的值是否相等 如果相等 就表示是这个分类 给其设置一个selected 
            if ($(item).attr('value') == response.state) {
              $(item).prop('selected', true);
            }
          });

          $('#created').val(response.createAt &&　response.createAt.substr(0,16));

          // 将保存按钮隐藏 将编辑按钮显示出来 
          $('#pAdd').hide();
          $('#pEdit').show();

        }
      })
    }



// 找到 pEdit这个按钮 给其添加click事件 然后发送ajax
$('#pEdit').on('click', function() {
    $.ajax({
        type: 'put',
        url: '/posts/' + id,
        data: $('form').serialize(),
        success: function(response) {
            location.href = 'posts.html'
        }
    })
})

