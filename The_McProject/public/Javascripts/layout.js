$(document).ready(
    function() {
        $.ajax({
            url:'/getUserImage',
            type: 'GET',
            success: function (data) {
                $('#profile_picture').attr("src", data);
            }
        })
        $("#navbar_username").html($.cookie("Username"));

    }
);