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
                    for (var i = data.length-1; i >= 0; i--) {
                        if (data[i].sender == friend || data[i].recipient == friend) {
                            if (data[i].sender == user) {
                                messages += "<div class='outgoing_msg'> <div class='sent_msg'> <p>"+data[i].message+"</p> " +
                                    "<span class='time_date'> 11:01 AM    |    Today</span> </div></div>";
                            }
                            else {
                                messages +=
                                    "<div class='incoming_msg'> <div class='incoming_msg_img'><img src='images/ronald_mcdonald.png' alt='sunil'> </div> " +
                                    "<div class='received_msg'> <div class='received_withd_msg'> <p>"+data[i].message+"</p> <span class='time_date'> 11:01 AM    |    Today</span></div> </div> </div>";
                            }
                        }
                    }

                    //generate conversations preview html for DOM
                    var active = "";
                    for (const message of threads) {
                        //insert "active_chat" class if current user's conversation is open
                        if (message.name == friend) active += "active_chat"
                        else active = "";
                        conversations += "<div id='"+message.name+"' class='chat_list "+active+"'> <div class='chat_people'> <div class='chat_img'> <img src='https://ptetutorials.com/images/user-profile.png' alt='sunil'>" +
                            "</div> <div class='chat_ib'> <h5>"+message.name+"<span class='chat_date'>Dec 25</span></h5> <p>"+message.message+"</p> </div> </div> </div>"
                    }

                    //insert strings as html
                    $(".msg_history").html(messages);
                    $(".inbox_chat").html(conversations);
                }
            })
            setTimeout(getMessages, 10000);
        }

        //when send button is clicked, send message
        $('.msg_send_btn').click(function (event) {
            $.ajax({
                url: '/messages/addMessage',
                type: 'POST',
                data: {
                    sender: user,
                    recipient: friend,
                    message: $('.write_msg').val(),
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
        $("div").on("click", "div.chat_list", function(event){
            friend = $(this).attr("id");
            $('#msg_history').animate({scrollTop: $('#msg_history').scrollHeight},"fast");
            getMessages();
        });
    }
);
