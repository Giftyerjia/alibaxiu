// 1.0 展示用户列表
render()

function render() {
    $.ajax({
        type: 'get',
        url: '/users',
        success: function(response) {
            // console.log(response);
            let str = template('tpl_user', response);
            $('#show_users').html(str);
        }
    })
}

// 将来保存上传图片的地址
let img_src = '';

// 2.0 上传图片文件
$('#show_form').on('change', '#avatar', function() {
    // 1.0 完成原生的formData的数据收集
    let form = new FormData();
    form.append('avatar', this.files[0]);

    // 2.0 发送jquery的请求
    $.ajax({
        type: 'post',
        url: '/upload',
        data: form,
        // 两个属性一定是在上传文件的时候才加
        processData: false,
        contentType: false,
        success: function(response) {
            $('#preview').attr('src', response[0].avatar);
            img_src = response[0].avatar;
        }
    })
})

// 3.0 添加用户信息
$('#add_user').on('click', function() {
    let formData = $('#form_data').serialize()
    formData = formData + '&avatar=' + img_src;
    $.ajax({
        type: 'post',
        url: '/users',
        data: formData,
        success: function(response) {
            location.reload()
        }
    })
})

// 4.0 使用事件委托的方式绑定点击编辑事件
$('#show_users').on('click', '#edit_user', function() {
    let id = $(this).parent().attr('data-id')
        // console.log(id);

    $.ajax({
        type: 'get',
        url: '/users/' + id,
        success: function(response) {
            // console.log(response);
            let str = template('modify_data', response);
            // console.log(str);
            $('#show_form').html(str);
        }
    })
})

// 5.0 使用事件委托的方式确认修改
$('#show_form').on('click', '#edit_user', function() {
    let id = $('#modify_user').attr('data-id');
    let formdata = $('#modify_user').serialize();
    if (img_src !== '') formdata = formdata + '&avatar=' + img_src;
    $.ajax({
        type: 'put',
        url: '/users/' + id,
        data: formdata,
        success: function(response) {
            location.reload();
        }
    })
})

// 6.0 使用事件委托的方式点击删除
$('#show_users').on('click', '#del_user', function() {
    let id = $(this).parent().attr('data-id');
    let confrim = window.confirm('确定是否删除吗？');
    if (!confrim) return;
    $.ajax({
        type: 'delete',
        url: '/users/' + id,
        success: function(response) {
            // location.reload();
            render();
        }
    })
})

// 7.0 设置全选全不选
$('#check_all').on('click', function() {
    $('#show_users').find(':checkbox').prop('checked', $(this).prop('checked'))
})

// 7.1 反选
$('#show_users').on('click', ':checkbox', function() {
    let len1 = $('#show_users').find(':checkbox').size();
    let len2 = $('#show_users').find(':checked').size();
    $('#check_all').prop('checked', len1 == len2);

    // 根据选中的个数，显示或者隐藏批量删除的按钮
    $('#del_many').css('display', len2 >= 2 ? 'inline-block' : 'none')
})

// 7.2 给批量删除注册事件
$('#del_many').on('click', function() {
    let ids = [];
    // 获取选中按钮的父元素td
    let ipts = $('#show_users').find(':checked').parent().siblings('.cls');
    // console.log(ipts);
    ipts.each(function(i, item) {
        // 遍历每一个td获取id加入到数组中
        ids.push($(item).attr('data-id'));
    })

    // 发送请求删除多项数据
    $.ajax({
        type: 'delete',
        url: '/users/' + ids.join('-'),
        success: function(response) {
            render();
        }
    })
})