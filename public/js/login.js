/*
 * Login JS file
 * @author Shaan Menon
 * @date 16th April 2016
 */
 
document.getElementById('login').addEventListener("click", function(){
    user = document.getElementById('username').value;
    pass = document.getElementById('password').value;
    pass = sha(pass)
    $.post('checkLogin', {user: user, password: pass, salt: salt}, function(data){
        if(data.checked == true){
            window.location = "/main";
        }
    })
 });