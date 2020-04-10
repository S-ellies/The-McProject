var queryString = "/users/getUsers";
function goToProfile(target) {
    $.ajax({
        url: queryString,
        type: 'GET',
        success: function (data) {
            $(location).attr('href', '/users/profile?user_name=' + data[target].user_name);
        }
    });
}

$(document).ready(
    function () {

        var user = $.cookie("Username"); //current user
        $("#searchForm").submit(function (event) {
            event.preventDefault();

            $("#users").empty();
            //var queryString = "/users/getUsers";
            var body = "";
            if (event.target.searchWord.value.length > 0)
                queryString += "?" + event.target.searchType.value + "=" + event.target.searchWord.value;
            $.ajax({
                url: queryString,
                type: 'GET',
                success: function (data) {
                    function goToProfile(target) {
                        $(location).attr('href', '/users/profile?user_name=' + target);
                    }
                    body = "";
                    var friends = [];
                    //find index of current user
                    var usrIndex;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].user_name == user)
                            usrIndex = i;
                    }
                    //dislay all relevant users
                    for (var i = 0; i < data.length; i++) {
                        //try to skip friends
                        try {
                            if (data[usrIndex].friends.includes(data[i]._id));
                            //skip self
                            else if (i !== usrIndex)
                                body += "<a href='/users/profile?user_name=" + data[i].user_name + "'<div id='" + data[i].user_name + "'>" + "<img src'" + data[i].image + "' alt='profile-pic'><h3>" + data[i].user_name + "</h3><h4>" + data[i].instrument + "</h4><p>" + data[i].bio + "</p></div></a>";
                        }
                        //in case of null pointer exception when looking for friends
                        catch (err) {
                            if (i !== usrIndex)
                                body += "<a href='/users/profile?user_name=" + data[i].user_name + "'<div id='" + data[i].user_name + "'>" + "<img src'" + data[i].image + "' alt='profile-pic'><h3>" + data[i].user_name + "</h3><h4>" + data[i].instrument + "</h4><p>" + data[i].bio + "</p></div></a>";
                        }
                    }
                    $("#users").html(body);
                }
            });
        });

    });