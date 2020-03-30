$(document).ready(
    function() {
        var user = $.cookie("Username"); //current user
        var friend; //conversation that user currently has open
        var threads = []; //array to store objects containing newest message for each conversation

        getMessages();

        function getMessages() {
            $.ajax({
                url: '/messages/getUserMessages',
                type: 'GET',
                success: function (data) {
                    var conversations = "";
                    var messages = "";
                    threads = [];

                    //open conversation with newest message by default
                    if (friend == undefined) {
                        if (data[0].sender == user) friend = data[0].recipient;
                        else friend = data[0].sender;
                    }

                    //populate array for conversation previews
                    for (var i = 0; i < data.length; i++) {
                        if (!contains(threads, "name", data[i].sender) && !contains(threads, "name", data[i].recipient)) {
                            if (data[i].sender == user) threads.push({name: data[i].recipient, message: data[i].message, date: data[i].date_created});
                            else if (data[i].recipient == user) threads.push({name: data[i].sender, message: data[i].message, date: data[i].date_created});
                        }
                    }

                    //generate current conversation messages html for DOM
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].sender == friend || data[i].recipient == friend) {
                            messages += "<div class='row justify-content-md-center pt-4'><div class='card col-md-6'><div class='row col-md-6'><h6>From: "
                                + data[i].sender + "</h6> <span style='margin-left:20px'>To:" + data[i].recipient + "</span></div>"+ data[i].message + "</div></div>";
                        }
                    }

                    //generate conversations preview html for DOM
                    for (const message of threads) {
                        conversations += "<div class='row justify-content-md-center pt-4'><div id='"+message.name+"' class='card col-md-6 thread'><div class='row col-md-6'><h6>"
                            + message.name + "</h6></div>"+ message.message + "</div></div>";
                    }

                    //insert strings as html
                    $("#messages").html(messages);
                    $("#conversations").html(conversations);
                }
            })
            setTimeout(getMessages, 10000);
        }

        //when send button is clicked, send message
        $('#send').click(function (event) {
            $.ajax({
                url: '/messages/addMessage',
                type: 'POST',
                data: {
                    sender: user,
                    recipient: friend,
                    message: $('#messageText').val(),
                    date_created: new Date(Date.now())
                },
                success: function(result) {
                    getMessages(user, friend);
                }
            });
        })

        //test if an object array contains a certain value for a certain field
        function contains(arr, key, val) {
            for (var i = 0; i < arr.length; i++) {
                if(arr[i][key] === val) return true;
            }
            return false;
        }

        //when conversation is clicked on, display that conversation's messages
        $("div").on("click", "div.thread", function(event){
            friend = $(this).attr("id");
            getMessages();
        });
    }
);
