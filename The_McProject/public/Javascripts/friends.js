$(document).ready(
    function () {

        getFriends();
        getUsers();
        $("div").on("click", "button.btn", function () {
            addFriend($(this).attr("id"));
        });


        function getFriends() {
            $.ajax({
                 url: '/friends/getUserFriends',
                 type: 'GET',
                 success: function(data) {
                     var friends = "";
                     for (var i = 0; i < data.length; i++) {
                         friends += "<div class='card col-sm-6' style='width: 18rem;'> <img class='card-img-top' src='"+data[i].image+"' alt='Card image cap'> <div class='card-body'> <h4 class='card-title'>"+data[i].user_name+"</h4> <p class='card-text'>"+data[i].bio+"</p> </div> </div>";
                     }
                     $('.friends').html(friends);
                 }
            })
        }

        function getUsers() {
            $.ajax({
                url: '/users/getUsers',
                type: 'GET',
                success: function (data) {
                    var users = "";
                    for (var i = 0; i < data.length; i++) {
                        users += "<div class='card col-sm-6' style='width: 18rem;'> <img class='card-img-top' src='"+data[i].image+"' alt='Card image cap'> <div class='card-body'> <h4 class='card-title'>"+data[i].user_name+"</h4> <p class='card-text'>"+data[i].bio+"</p> <button id='"+data[i]._id+"' class='btn btn-primary'>Add Friend</button> </div> </div>";
                    }
                    $('.users').html(users);
                }
            })
        }

        function addFriend(id) {
            $.ajax({
                url: '/friends/addFriend',
                type: 'PUT',
                data: {
                    id: id
                },
                success: function() {
                    getFriends();
                    getUsers();
                }
            })
        }

    }
);





