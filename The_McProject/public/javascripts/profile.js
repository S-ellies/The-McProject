
$(document).ready(
    function () {
        //get the desired user from url param
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
        //get loged in user if no other is requested
        if (user == undefined)
            user = $.cookie("Username");
        loadUser();
        function loadUser() {
            $.ajax({
                url: '/users/getUsers?user_name=' + user,
                type: 'GET',
                success: function (data) {
                    var instruments = "";
                    $('#usrName').html(data[0].user_name);
                    $('#profileImg').html("<img src='" + data[0].image + "' alt='profilePic'");
                    $('#usrBio').html(data[0].bio);
                    $('#location').html(data[0].location);
                    for(var i = 0; i < data[0].instrument.length - 1; i++)
                        instruments += data[0].instrument[i];
                    $('#usrInstruments').html(instruments);
                    if (user === $.cookie("Username"))
                        $('#addFriend').hide();
                }
            });
        }
        
    });
