let registerForm=document.getElementById('registerForm');
let apiUrl="http://localhost:3000";
if(location.href.indexOf("netlify") >= 0 ){
  apiUrl="https://netflix-clone-praj.herokuapp.com/";
}

registerForm.addEventListener('submit',function(e){
    e.preventDefault();
  console.log("hello");
  let payload={
    name:registerForm.name.value,
    email: registerForm.email.value,
    password:registerForm.password.value,
  }
  console.log(e,"Submitted");
  fetch(apiUrl + "/register" ,{
    method:"POST",
    headers:{'Content-Type':'application/json'},  //sending JSON content
    body:JSON.stringify(payload)
  })
  .then((response)=>{
    if(response.ok)
    {
            return response.json();
    }
  else{
      throw new Error("Something went wrong");
  }
}) // returns a promise already
.then((response)=>{
  location.href=`/login.html?existingEmail=${payload.email}&registered=true`;
}).catch((error)=>{
  
  location.href=`/login.html?existingEmail=${payload.email}`
})
})
