/**
 * Retrieve user JSON
 * Stick it onto webpage
 * Repeat until good amount of users found
 * If time permits:
 *      1. Sort displayed users by:
 *          a. Distance(to a degree)
 *          b. Relevance(with some algorithm to determine relevance)
 *      2. Don't display already connected users
 */
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
                    for (var i = 0; i < data.length; i++) {
                        //if (data[i].user_name !== user)
                            body += "<div id='" + data[i].user_name + "'>" + "<img src'" + data[i].image + "' alt='profile-pic'><h3>" + data[i].user_name + "</h3><h4>" + data[i].instrument + "</h4><p>" + data[i].bio + "</p></div>";
                    }
                    $("#users").append(body);
                }
            });
        });
    });