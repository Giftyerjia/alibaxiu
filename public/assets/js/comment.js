$('#logoutBtn').on('click', function() {
    let isComfirm = confirm('确认是否退出');
    if (!isComfirm) return;

    $.ajax({
        type: 'post',
        url: '/logout',
        success: function(response) {
            location.href = 'login.html';
        }
    })
})