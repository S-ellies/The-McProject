
$(document).ready(
    function () {
        var user = $.cookie("Username"); //current user
        console.log(test);
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
                    var friends = [];
                    //find index of current user
                    var usrIndex;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].user_name == user)
                            usrIndex = i;
                    }
                    console.log(user);
                    //dislay all relevant users
                    for (var i = 0; i < data.length; i++) {
                        //skip friends
                        if (data[usrIndex].friends.includes(data[i]._id));
                        //skip self
                        else if (i !== usrIndex)
                            body += "<div id='" + data[i].user_name + "'>" + "<img src'" + data[i].image + "' alt='profile-pic'><h3>" + data[i].user_name + "</h3><h4>" + data[i].instrument + "</h4><p>" + data[i].bio + "</p></div>";
                    }
                    $("#users").append(body);
                }
            });
        });
    });