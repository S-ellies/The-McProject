$(document).ready(
    function () {
        
        getFriends();
        getUsers();
        //adds user to friensd
        $('#addFriend').click(function () {
            var getUrlParameter = function getUrlParameter(sParam) {
                var sPageURL = window.location.search.substring(1),
                    sURLVariables = sPageURL.split('&'),
                    sParameterName,
                    i;
    
                for (i = 0; i < sURLVariables.length; i++) {
                    sParameterName = sURLVariables[i].split('=');
    
                    if (sParameterName[0] === sParam) {
                        return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                    }
                }
            };
            var user = getUrlParameter("user_name");
            $.ajax({
                url: '/users/getUsers?user_name=' + user,
                type: 'GET',
                success: function (data) { 
                    addFriend(data[0]._id);
                }
            });
        });
        /*
        $("div").on("click", "button.btn", function () {
            addFriend($(this).attr("id"));
        });
        */

        function getFriends() {
            $.ajax({
                 url: '/friends/getUserFriends',
                 type: 'GET',
                 success: function(data) {
                     var friends = "";
                     console.log(data);
                     for (var i = 0; i < data.length; i++) {
                         friends += "<div class='card' style='width: 18rem;'> <img class='card-img-top' src='"+data[i].image+"' alt='Card image cap'> <div class='card-body'> <h4 class='card-title'>"+data[i].user_name+"</h4> <p class='card-text'>"+data[i].bio+"</p> </div> </div>";
                     }
                     $('#Friends').html(friends);
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
                        if (!contains(data[i].friends, $.cookie('UserID').split("\"")[1]) && data[i]._id != $.cookie('UserID').split("\"")[1])
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

        function contains(arr, val) {
            for (var i = 0; i < arr.length; i++) {
                if(arr[i] == val) return true;
            }
            return false;
        }

    }
);





