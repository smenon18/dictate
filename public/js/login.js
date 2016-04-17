/*
 * Login JS file
 * @author Shaan Menon
 * @date 16th April 2016
 */
 
document.getElementById('login').addEventListener("click", function(){
    user = document.getElementById('username').value;
    pass = document.getElementById('password').value;
    pass = sha(pass);
    $.post('/checkLogin', {user: user, password: pass}, function(data){
        if(data.checked == true){
            window.location = "/home.html";
        } else {
             var n = noty(
                    {
                        layout: 'topRight',
                        theme: 'relax',
                        type: 'error',
                        text: 'Error loging in, please try again.',
                        animation:
                        {
                            open: 'animated fadeInRightBig',
                            close: 'animated fadeOutLeft'
                        },
                        maxVisible: 5,
                        closeWith: ['click'],
                        timeout: 2500,    //2500ms
                        buttons: false
                    });
        }
    })
 });
 
document.getElementById('signup').addEventListener("click", function(){
    user = document.getElementById('username');
    pass = document.getElementById('password').value;
    pass = sha(pass);
    $.post('/signup', {user: user, password: pass}, function(data){
        if(data.checked == true){
            var n = noty(
                    {
                        layout: 'topRight',
                        theme: 'relax',
                        type: 'success',
                        text: 'Signup Success!',
                        animation:
                        {
                            open: 'animated fadeInRightBig',
                            close: 'animated fadeOutLeft'
                        },
                        maxVisible: 5,
                        closeWith: ['click'],
                        timeout: 2500,    //2500ms
                        buttons: false
                    });
        } else {
            var n = noty(
                    {
                        layout: 'topRight',
                        theme: 'relax',
                        type: 'error',
                        text: 'Error loging in, please try again.',
                        animation:
                        {
                            open: 'animated fadeInRightBig',
                            close: 'animated fadeOutLeft'
                        },
                        maxVisible: 5,
                        closeWith: ['click'],
                        timeout: 2500,    //2500ms
                        buttons: false
                    });
        }
    });
});

function sha(password)
{   
    //Check for empty fields.
    if(password === '')
    {
        var error = true;
        return error;
    }
    else
    {
        var shaObj = new jsSHA("SHA-256", 'TEXT');
        shaObj.update(password.toString());
        var hash = shaObj.getHash('HEX');
        
        return hash;
    }
}