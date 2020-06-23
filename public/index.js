if (localStorage.getItem("token")) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            window.alert("you have auth");
            window.location.href = "./socialFeed/index.html";
        } else if (this.status === 401 || this.status === 500) {
            window.alert("auth failed");
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            localStorage.removeItem("name");
            window.location.assign("http://localhost:3000");
        }
    };
    xhttp.open("GET", "http://localhost:3000/auth", true);
    xhttp.setRequestHeader("x-auth-token", localStorage.getItem("token"));
    xhttp.send();
}


let menu = document.querySelectorAll(".homepage .menu li");

let signIn = document.querySelector(".homepage #sign-in");
let logIn = document.querySelector(".homepage #log-in");
let intro = document.querySelector(".homepage #intro");

let signInData = document.querySelectorAll(".homepage #sign-in input");
let logInData = document.querySelectorAll(".homepage #log-in input");
var xhttp = new XMLHttpRequest();
menu[0].onclick = () => {
    signIn.style.opacity = "1";
    signIn.style.display = "block";
    intro.style.opacity = "0";
    intro.style.display = "none";
    logIn.style.opacity = "0";
    logIn.style.display = "none";
};

menu[1].onclick = () => {
    logIn.style.opacity = "1";
    logIn.style.display = "block";
    signIn.style.opacity = "0";
    signIn.style.display = "none";
    intro.style.opacity = "0";
    intro.style.display = "none";
};

signInData[3].onclick = () => {
    let data = {
        name: signInData[0].value,
        email: signInData[1].value,
        password: signInData[2].value,
    };
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let val = JSON.parse(this.responseText);
            localStorage.setItem("token", val.token);
            localStorage.setItem("name", val.name);
            localStorage.setItem("id", val.id);
            window.location.href = "./socialFeed/index.html";
        }
    };
    xhttp.open("POST", "http://localhost:3000/users", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(data));
};


logInData[2].onclick = () => {
    let data = {
        email: logInData[0].value,
        password: logInData[1].value,
    };

    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let val = JSON.parse(this.responseText);
            localStorage.setItem("token", val.token);
            localStorage.setItem("name", val.name);
            localStorage.setItem("id", val.id);
            window.location.href = "./socialFeed/index.html";
        } else if (this.status === 400) {
            window.alert("auth failed");
            window.location.assign("http://localhost:3000");
        }
    };
    xhttp.open("GET", "http://localhost:3000/users/" + data.email + "/" + data.password, true);
    xhttp.send();
};