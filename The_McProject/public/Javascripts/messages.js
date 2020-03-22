var user = "Morf";
var friend = "Boshco";
$(document).ready(
    function() {
        getMessages(user, friend);
        function getMessages(sender, recipient) {
            $.ajax({
                url: '/messages/getConversation?sender='+sender+"&recipient="+recipient,
                type: 'GET',
                success: function (data) {
                    var messages = "";
                    for (var i = 0; i < data.length; i++) {
                        messages += "<div class='row justify-content-md-center pt-4'><div class='card col-md-6'><div class='row col-md-6'><h6>" + data[i].sender + "</h6></div>"+ data[i].message + "</div></div>";
                    }
                    $("#messages").html(messages);
                }
            })
            setTimeout(function() { getMessages(user, friend); }, 10000);
        }

        $('#send').click(function (event) {
            $.ajax({
                url: '/messages/addMessage',
                type: 'POST',
                data: {sender: "Morf",
                    recipient: "Boshco",
                    message: $('#messageText').val()},
                success: function(result) {
                    getMessages(user, friend);
                }
            });
        })
    }
);
