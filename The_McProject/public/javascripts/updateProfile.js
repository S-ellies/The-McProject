/**
 * target form to get values
 * create JSON
 * link to api to update user information
 * look at auth.js for reference
 */

/**
 * target form for changing specific user information i.e update password, user name, instruments etc.
 */
var models = require('/userModel.js');
$("personInfo").submit(
    function(){
        let formData = {
            name: this.uname.value,
            instrument: this.instrument-group.value,
            email: this.emailaddr.value,
            location: this.location.value,
            bio: this.bio.value,
            password = this.password.value
        }
    });

    models.update(
        {user_name : this.name},formData
    );