//login
function login(e) {
    e.preventDefault();
    const {loginEmail, loginPassword} = e.target;

    const loginDetails = {
        email: loginEmail.value, 
        password: loginPassword.value
    }

    axios.post('http://localhost:3000/user/login', loginDetails)
    .then((res) => {
       
        if (res.status == 200) {
            localStorage.setItem('token', res.data.token);
            alert(res.data.message);
            window.location.href = '../views/chat.html';
        }
        else {
            throw new Error('failed to login')
        }
    })
    .catch(err => {
      // handleError(e.target,err.response.data.message);
      console.log(err);
    })
}

function showForgotPassword() {
    window.location.href = "../views/forgetpassword.html"
}
function signup() {
    window.location.href = "../views/signup.html"
}
