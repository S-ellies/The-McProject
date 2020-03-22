$(document).ready(
    function() {
        function getMessages() {
            $.ajax({
                url: '/messages/getMessages',
                type: 'GET',
                success: function (data) {
                    var messages = "";
                    for (var i = 0; i < data.length; i++) {
                        messages += "<div class='row justify-content-md-center pt-4'>" +
                            "<div class='card col-md-6'>"
                            + data[i].message + "</div></div>";
                    }
                    $("#messages").html(messages);
                }
            })
        }

        $('#send').click(function (event) {
            $.ajax({
                url: '/messages/addMessage',
                type: 'POST',
                data: {sender: "Murf",
                    recipient: "Jo Mama",
                    message: $('#messageText').val()},
                success: function(result) {
                    getMessages();
                }
            });
        })
    }
);
