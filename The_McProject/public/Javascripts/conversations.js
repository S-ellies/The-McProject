$(document).ready(
    function() {
        const user = $.cookie("Username");


        getRecentMessages();
        function getRecentMessages() {
            $.ajax({
                url: 'conversations/getRecentMessages',
                type: 'GET',
                success: function (data) {
                    console.log(data);
                    var recentMessages = "";
                    for (var i = 0; i < data.length; i++) {
                        recentMessages += "<div id='"+data[i].friend+"' class='chat_list'> <div class='chat_people'> <div class='chat_img'> <img src='https://ptetutorials.com/images/user-profile.png' alt='sunil'>" +
                            "</div> <div class='chat_ib'> <h5>"+data[i].friend+"<span class='chat_date'>Dec 25</span></h5> <p>"+data[i].message+"</p> </div> </div> </div>";
                    }
                    $(".inbox_chat").html(recentMessages);
                }
            })
        }
    }
);