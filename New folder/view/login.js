const usernameInput = document.getElementById("username-input")
const passwordInput = document.getElementById("password-input")
const loginBtn = document.getElementById("login-btn")


loginBtn.addEventListener('click', async (e) => {
    const username = usernameInput.value;
    const password = passwordInput.value;


    const loginFetch = await fetch("http://localhost:3000/login", {
        method: "POST",
        body: JSON.stringify({
            username: username,
            password: password
        }),
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    })

    const data = await loginFetch.json();

    if(data.status == 404){
        alert("Error no user exists")
        passwordInput.value = "";
        return;
    }

    sessionStorage.userData = data.response;
    window.location.href = "index.html";

})