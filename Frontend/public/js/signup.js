//signup
function signUp(e){
    e.preventDefault();
    const userDetails = {
        username: e.target.username.value,
        email: e.target.signupEmail.value,
        phoneNumber: e.target.signupPhone.value,
        password: e.target.signupPassword.value
    }

    axios.post('http://localhost:3000/user/sign-up', userDetails)
    .then((response)=>{
        if(response.status===201){
            console.log("response");
            window.location.href="../views/login.html"//change the page on successful login
        }
        else{
             throw new 'User already exists';
        }
    })
    .catch((err)=>{
        //handleError(e.target,err.response.data.message);
        console.log(err);
    })
}