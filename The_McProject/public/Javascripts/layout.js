$(document).ready(
    function() {
        $.ajax({
            url:'/getUserImage',
            type: 'GET',
            success: function (data) {
                console.log("function running");
            $('.avatar').html("<a class='nav-link p-0' href='/messages'> <img src='"+data+"' class=''rounded-circle z-depth-0'alt='avatar image' height='35'>"+$.cookie("Username")+"</a>");
            }
        })
    }
);