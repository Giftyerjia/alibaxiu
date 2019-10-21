$('#logout').on('click', function () {
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

// 1找到 id="image"给它添加 change事件
$("#image").on("change", function () {
    // 用户选择到的文件
    var file = this.files[0];
    // console.log(file);
    // 创建formData对象实现二进制文件上传
    var formData = new FormData();
    // 将管理员选择到的文件添加到formData对象中
    formData.append("image", file);
    // 向服务器端发送请求 实现图片上传
    $.ajax({
      type: "post",
      url: "/upload",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        console.log(response)
        //   // 添加到隐藏域里面
        $("#file").val(response[0].image);
        // 将其预览出来
        $("#prev").show().attr("src", response[0].image);
      }
    });
  });

  // 需要在这里创建一个空数组  只是我们添这个服务器添加一个轮番
  var arr = [];
  // 给添加按钮 注册点击事件  
  $('#pAdd').on('click', function () {
    // console.log($('form').serialize());
    // 发送ajax  
    $.ajax({
      url: '/slides',
      type: 'post',
      data: $('form').serialize(),
      success: function (res) {
        // 将数据追到数组中 
        arr.push(res);
        // 调用 render函数  
        render(arr);
      }
    });
  });

  // 获取所有的轮播图片 
  $.ajax({
    url: '/slides',
    type: 'get',
    success: function (res) {
      // 将这个res赋值给 arr 
      arr = res;
      render(arr);
    }
  })

  // 封装一个函数  用于渲染 
  function render(data) {
    var html = template('sTpl', { res: data })
    // console.log(html);
    $('tbody').html(html);
  }

  // 给每一个删除按钮注册 点击事件  需要使用事件委托 
  $('tbody').on('click', '.del', function () {
    if (confirm('你确定要删掉我吗?')) {
      // console.log('ok');
      let id = $(this).attr('data-id');
      // 发送ajax 
      $.ajax({
        url: '/slides/' + id,
        type: 'delete',
        success: function (res) {
          // 我们需要根据 res._id 对应的数组元素的索引值给我们  
          var index = arr.findIndex(item =>
            item._id == res._id
          )
          // 想实现无刷新删除  手动将数组里面的这个元素给删除  然后重新调用 render 
          arr.splice(index, 1);
          render(arr)
        }
      });
    }
  });