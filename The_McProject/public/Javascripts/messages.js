$(document).ready(
    function() {
        var user = "Morf";
        var friend;

        $('#seb').click(function (event) {
            friend = "Seb";
            getMessages();
        });
        $('#boshco').click(function (event) {
            friend = "Boshco";
            getMessages();
        });
        $('#jim').click(function (event) {
            friend = "Jim";
            getMessages();
        });

        getMessages();

        function getMessages() {
            $.ajax({
                url: '/messages/getUserMessages',
                type: 'GET',
                success: function (data) {
                    var messages = "";
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].sender == friend || data[i].recipient == friend) {
                            messages += "<div class='row justify-content-md-center pt-4'><div class='card col-md-6'><div class='row col-md-6'><h6>From: "
                                + data[i].sender + "</h6> <span style='margin-left:20px'>To:" + data[i].recipient + "</span></div>"+ data[i].message + "</div></div>";
                        }
                    }
                    $("#messages").html(messages);
                }
            })
            setTimeout(function() { getMessages(); }, 10000);
        }

        $('#send').click(function (event) {
            $.ajax({
                url: '/messages/addMessage',
                type: 'POST',
                data: {
                    sender: user, recipient: friend,
                    message: $('#messageText').val()
                },
                success: function(result) {
                    getMessages(user, friend);
                }
            });
        })
    }
);
