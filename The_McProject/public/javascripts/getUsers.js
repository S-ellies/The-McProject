
$(document).ready(
    function () {
        var user = $.cookie("Username"); //current user
        $("#searchForm").submit(function (event) {
            event.preventDefault();

            $("#users").empty();
            var queryString = "/users/getUsers";
            var body = "";
            if (event.target.searchWord.value.length > 0)
                queryString += "?" + event.target.searchType.value + "=" + event.target.searchWord.value;
            $.ajax({
                url: queryString,
                type: 'GET',
                success: function (data) {
                    body = "";
                    //find index of current user
                    var usrIndex;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].user_name == user)
                            usrIndex = i;
                    }
                    var friends = [];
                    $.ajax({
                        url: '/friends/getUserFriends',
                        type: 'GET',
                        success: function (data) {
                            for(var i = 0; i < data.length -1; i++)
                                friends.push(data[i]);
                        }
                    });
                    //dislay all relevant users
                    for (var i = 0; i < data.length; i++) {
                        //skip friends
                        if (friends.includes(i))
                            console.log(i);
                        //skip self
                        else if (i !== usrIndex)
                            body += "<div id='" + data[i].user_name + "'>" + "<img src'" + data[i].image + "' alt='profile-pic'><h3>" + data[i].user_name + "</h3><h4>" + data[i].instrument + "</h4><p>" + data[i].bio + "</p></div>";
                    }
                    $("#users").append(body);
                }
            });
        });
    });