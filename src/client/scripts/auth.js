function toggleLoginSignupContainer(){
    const loginContainer = document.getElementById("loginContainer");
    const signupContainer = document.getElementById("signupContainer");

    if (loginContainer.style.display == "flex"){
        loginContainer.style.display = "none";
        signupContainer.style.display = "flex";
    } else {
        loginContainer.style.display = "flex";
        signupContainer.style.display = "none";
    }
}

async function requestSignup(){
    const usernameSignupInput = document.getElementById("usernameSignupInput");
    const typeSignupInput = document.getElementById("typeSignupInput");
    const passwordSignupInput = document.getElementById("passwordSignupInput");
    const confirmPasswordSignupInput = document.getElementById("confirmPasswordSignupInput");

    fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: usernameSignupInput.value,
            type: typeSignupInput.value,
            password: passwordSignupInput.value,
            confirmpassword: confirmPasswordSignupInput.value,
            token: grecaptcha.getResponse(),
        }),
    }).then(response => {
        return response.json();
    }) .then(data => {
        res = JSON.parse(data);
        alert(res)

        if (res[0] == 200){
            toggleLoginSignupContainer();
        }
    }).catch(error => {
        console.error('Fetch error:', error);
    });
}

async function requestLogin(){
    const usernameLoginInput = document.getElementById("usernameLoginInput");
    const passwordLoginInput = document.getElementById("passwordLoginInput");

    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: usernameLoginInput.value,
            password: passwordLoginInput.value,
        }),
    }).then(response => {
        return response.json();
    }) .then(data => {
        res = JSON.parse(data);
        alert(res)

        if (res[0] == 200){
            window.location.href = "/"
        }
    }).catch(error => {
        console.error('Fetch error:', error);
    });
}

function init(){
    toggleLoginSignupContainer();
}

init()