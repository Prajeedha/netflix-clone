function checkIfLoggedIn(){
   const currentToken=localStorage.getItem('token');
   if(currentToken){
       console.log(currentToken);
       if(location.href.includes("/login.html") || location.href.includes("/register.html") ){
    location.href="/";
   }
}else{
    //if i am currently not logged in anf trying to acess a unauthorized page
    //(Trying to access all pages besides login page)
    if( !location.href.includes("/login.html") && !location.href.includes("/register.html")){
        location.href='/login.html';
    }
}
}

checkIfLoggedIn();

function logOut(){
    localStorage.removeItem('token');
    location.href="/login.html";
}


