$(document).ready(
    function() {
        $.ajax({
            url:'/getUserImage',
            type: 'GET',
            success: function (data) {
            $('.navbar-user').html("<a class='nav-link p-0' href='/messages' > <img src='"+data+"' class='rounded-circle z-depth-0'alt='avatar image' height='35' style='margin-right: 5px;'><span style='vertical-align: center;'>"+$.cookie("Username")+"</span></a>");
            }
        })
    }
);