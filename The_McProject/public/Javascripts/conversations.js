$(document).ready(
    function() {
        //global variables
        const user = $.cookie('Username');
        const userID = $.cookie('UserID').split("\"")[1];
        var friendPhoto;
        var newConvoUserID;
        var currentConversation;
        var newConvo = false;

        //function calls
        getRecentMessages();
        $('.search-button').click(newConversation);
        $('.msg_send_btn').click(sendMessage);
        $("div").on("click", "div.chat_list", function(event){
            currentConversation = $(this).attr("id");
            $('#msg_history').animate({scrollTop: $('#msg_history').scrollHeight},"fast");
            getConversation(currentConversation);
        });

        //function definitions
        function getRecentMessages() {
            $.ajax({
                url: 'conversations/getRecentMessages',
                type: 'GET',
                success: function (data) {
                    if (currentConversation == null) if (data.length > 0) currentConversation = data[0].conversation_id;
                    var recentMessages = "";
                    var you = "";
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].sent_by == user) you += "You: ";
                        recentMessages += "<div id='"+data[i].conversation_id+"' class='chat_list'> <div class='chat_people'> <div class='chat_img'> <img src='"+data[i].image+"' alt='sunil'>" +
                            "</div> <div class='chat_ib'> <h5>"+data[i].friend+"<span class='chat_date'>Dec 25</span></h5> <p>"+you+data[i].message+"</p> </div> </div> </div>";
                        you = "";
                    }
                    $(".inbox_chat").html(recentMessages);
                    if (!newConvo && data.length > 0) getConversation(currentConversation);
                }
            })
            setTimeout(getRecentMessages, 10000);
        }

        function getConversation(id) {
            $.ajax({
                url: '/conversations/getConversation/'+id,
                type: 'GET',
                success: function (data) {
                    var messages = "";
                    var img;
                    if (data.users[0].user_name == user) img = data.users[1].image;
                    else img = data.users[0].image;
                    for (var i = data.messages.length-1; i >= 0; i--) {
                        formatTime(data.messages[i].date_created);
                        if (data.messages[i].sent_by == user) {
                            messages += "<div class='outgoing_msg'> <div class='sent_msg'> <p>"+data.messages[i].message+"</p> " +
                                "<span class='time_date'> "+formatTime(data.messages[i].date_created)+"    |    "+formatDate(data.messages[i].date_created)+"</span> </div></div>";
                        }
                        else {
                            messages +=
                                "<div class='incoming_msg'> <div class='incoming_msg_img'><img src='"+img+"' alt='sunil'> </div> " +
                                "<div class='received_msg'> <div class='received_withd_msg'> <p>"+data.messages[i].message+"</p> <span class='time_date'> "+formatTime(data.messages[i].date_created)+"    |    "+formatDate(data.messages[i].date_created)+"</span></div> </div> </div>";
                        }
                    }
                    $(".msg_history").html(messages);
                }
            })
        }

        function sendMessage() {
            if (newConvo) {
                $.ajax({
                    url: 'conversations/newConversation',
                    type: 'POST',
                    data: {
                        users: [userID, newConvoUserID],
                        messages: [{
                            sent_by: user,
                            message: $('.write_msg').val()
                        }]
                    },
                    success: function (data) {
                        console.log(data);
                        $.ajax({
                            url: 'conversations/updateConversations',
                            type: 'PUT',
                            data: {
                                users: [userID, newConvoUserID],
                                conversation: data.id
                            },
                            success: function() {
                                console.log("success");
                                getRecentMessages();
                                getConversation(data.id);
                                $('.msg_history').css("flex-direction", "column-reverse");
                            }
                        })
                    }
                })
            }
            else if (!newConvo) {
                $.ajax({
                    url: 'conversations/sendMessage',
                    type: 'PUT',
                    data: {
                        sent_by: user,
                        message: $('.write_msg').val(),
                        conversation_id: currentConversation
                    },
                    success: function () {
                        $('.write_msg').val("");
                        getRecentMessages();
                        scrollBottom();
                    }
                })
            }
        }

        function newConversation() {
            //use js to display html
            $.ajax({
                url: '/conversations/getUserID/'+$('.search-bar').val(),
                type: 'GET',
                success: function (data) {
                    console.log(data);
                    if (data == "No user found") {
                        alert("No user found")
                    }
                    else {
                        newConvo = true;
                        $('.msg_history').html("<h1>"+data.user_name+"</h1>");
                        $('.msg_history').css("flex-direction", "column");
                        newConvoUserID = data._id;
                    }
                }
            })
        }

        function formatDate(otherDate) {
            const date = new Date(otherDate);
            const currentDate = new Date(Date.now());
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            if (currentDate.getFullYear() === date.getFullYear() &&
                currentDate.getMonth() === date.getMonth()) {
                if (currentDate.getDate() === date.getDate()) return "Today";
                else if (currentDate.getDate() === date.getDate() + 1) return "Yesterday"
                else if (currentDate.getDate() - date.getDate() < 7) return days[date.getDay()];
                else return months[date.getMonth()]
            }
            else if (currentDate.getFullYear() === date.getFullYear()) {
                return months[date.getMonth()];
            }
            else return (currentDate.getFullYear());

        }

        function formatTime(otherDate) {
            const date = new Date(otherDate);
            const currentDate = new Date(Date.now());
            const timeDifference = currentDate.getTime() - date.getTime();
            var hour;
            if (timeDifference < 10000) return "Just now"
            else if (timeDifference < 60000) return Math.floor(timeDifference/1000)+"s ago";
            else if (timeDifference < 3600000) return Math.floor(timeDifference/60000)+"m ago";
            else if (timeDifference < 86400000) return Math.floor(timeDifference/3600000)+"h ago";
            else if (date.getHours() < 13) {
                if (date.getHours() == 0) hour = 12;
                else hour = date.getHours();
                return hour+":"+date.getMinutes()+" AM";
            }
            else {
                hour = date.getHours() - 12;
                return hour+":"+date.getMinutes()+" PM";
            }
        }

        function scrollBottom() {
            var element = document.getElementById("msg_history");
            element.scrollTop = element.scrollHeight;
        }
    }
);