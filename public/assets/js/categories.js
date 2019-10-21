// 1.0 添加分类数据
$('#add_cate').on('click', function() {
    let formData = $('#form_cate').serialize();
    $.ajax({
        type: 'post',
        url: '/categories',
        data: formData,
        success: function(response) {
            // console.log(response)
            render()
            $('#title, #className').val('')
        }
    })
})

// 2.0 请求所有的分类数据
render();

function render() {
    $.ajax({
        type: 'get',
        url: '/categories',
        success: function(response) {
            let str = template('cate_tpl', response);
            $('#show_cate').html(str);
        }
    })
}

// 3.0 根据事件委托的方式点击编辑按钮
$('#show_cate').on('click', '.edit_cate', function() {
    let id = $(this).parent().attr('data-id');
    $.ajax({
        type: 'get',
        url: '/categories/' + id,
        success: function(response) {
            // console.log(response);
            let str = template('modify_cate_tpl', response);
            // console.log(str);
            $('#show_form').html(str)
        }
    })
})

// 3.2 使用事件委托的方式修改分类
$('#show_form').on('click', '#mod_cate', function() {
    let formData = $('#modifi_cate').serialize();
    let id = $('#modifi_cate').attr('data-id');
    $.ajax({
        type: 'put',
        url: '/categories/' + id,
        data: formData,
        success: function() {
            render()
            $('#mod_title, #mod_className').val('')
        }
    })
})

// 3.2 使用事件委托的方式删除分类
$('#show_cate').on('click', '.del_cate', function() {
    let id = $(this).parent().attr('data-id');
    $.ajax({
        type: 'delete',
        url: '/categories/' + id,
        success: function() {
            render()
        }
    })
})