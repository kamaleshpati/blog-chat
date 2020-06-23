if (localStorage.getItem("token")) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            window.alert("you have auth");

            // sessionStorage.setItem("password", JSON.parse(this.responseText).password);
            // window.location.href = "./socialFeed/index.html";
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



let blogs = [];
let users = [];
let primeuser = 0;
let blogcontainer = document.querySelector(".social #all-blogs");
let userContainer = document.querySelector(".social #all-users");

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
        blogs = JSON.parse(this.responseText);
        for (let i = blogs.length - 1; i >= 0; i--) {
            let div = document.createElement("div");
            div.setAttribute("id", "blog");
            div.innerHTML = "<h1>" + blogs[i].heading + "</h1>" + "<p>" + blogs[i].description + "</p>" + "<p id='delete'>Delete</p>";
            blogcontainer.appendChild(div);
        }
    }
};
xhttp.open("GET", "http://localhost:3000/posts", true);
xhttp.send();


var xhttp1 = new XMLHttpRequest();
xhttp1.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
        users = JSON.parse(this.responseText);
        for (let i = 0; i < users.length; i++) {
            if (localStorage.getItem("id") !== users[i]._id) {
                let div = document.createElement("div");
                div.setAttribute("id", "user");
                div.innerHTML = "<img src='./user.jpeg'></img>" + "<span>" + users[i].name + "</span>";
                userContainer.appendChild(div);
            } else {
                primeuser = i;
            }
        }
    }
};
xhttp1.open("GET", "http://localhost:3000/users", true);
xhttp1.send();
let div1 = document.createElement("div");
div1.setAttribute("id", "current-user");
div1.innerHTML = "<img src='./user.jpeg'></img>" + "<p>" + localStorage.getItem("name") + "</p>";
document.querySelector(".social #self").appendChild(div1);


document.querySelector(".social #logout").onclick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    window.alert("u have been logged out");
    window.location.assign("http://localhost:3000");
};

var modal = document.getElementById("myModal");
var btn = document.getElementById("create");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
    modal.style.display = "block";
};
span.onclick = function() {
    modal.style.display = "none";
};
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

var blogSubmit = document.querySelector(".modal-content #submit");
blogSubmit.onclick = () => {
    let data = {
        "heading": document.querySelector(".modal-content #heading").value,
        "description": document.querySelector(".modal-content #description").value
    };
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            console.log(this.responseText);
            window.alert("created");
            window.location.reload();
        }
    };
    console.log(localStorage.getItem("token"));
    xhttp.open("POST", "http://localhost:3000/posts/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("x-auth-token", localStorage.getItem("token"));
    xhttp.send(JSON.stringify(data));
};


document.querySelector(".nav-menu #chat").onclick = () => {
    // window.open("../chats/index.html", "_blank");
    if (sessionStorage.getItem("password") === null || sessionStorage.getItem("password") === undefined) {
        let psw = window.prompt("password");
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let output = JSON.parse(this.responseText);
                if (output.msg === true) {
                    sessionStorage.setItem("password", psw);
                    window.alert("you have been authorized");
                    window.open("../chats/index.html", "_blank");
                } else {
                    window.alert("not authorized");
                }

            } else if (this.status === 401 || this.status === 500) {
                window.alert("auth failed");
                localStorage.removeItem("token");
                localStorage.removeItem("id");
                localStorage.removeItem("name");
                window.location.assign("http://localhost:3000");
            }
        };
        xhttp.open("GET", "http://localhost:3000/auth/" + psw, true);
        xhttp.setRequestHeader("x-auth-token", localStorage.getItem("token"));
        xhttp.send();
    } else {
        window.open("../chats/index.html", "_blank");
    }
};

document.body.onload = () => {
    let blogList = document.querySelectorAll(".social #all-blogs #blog #delete");
    for (let i = 0; i < blogList.length; i++) {
        blogList[i].onclick = (e) => {
            console.log(blogs[blogs.length - 1 - i]._id);
            if (blogs[blogs.length - 1 - i].userId !== localStorage.getItem("id"))
                window.alert("u r not authorized");
            else {
                // e.target.parentNode.style.display = "none";
                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState === 4 && this.status === 200) {
                        let output = JSON.parse(this.responseText);
                        console.log(output);
                        if (output.msg === "deleted") {
                            window.alert("done");
                            e.target.parentNode.style.display = "none";
                        }
                    } else if (this.status === 401 || this.status === 500) {
                        window.alert("auth failed");
                        window.location.assign("http://localhost:3000");
                    }
                };
                xhttp.open("DELETE", "http://localhost:3000/posts/" + blogs[blogs.length - 1 - i]._id, true);
                xhttp.setRequestHeader("x-auth-token", localStorage.getItem("token"));
                xhttp.send();
            }
        };
    }

    let userList = document.querySelectorAll(".social #all-users #user");
    let div = document.createElement("div");
    div.className = "tooltiptext";
    for (let i = 0; i < blogList.length; i++) {
        userList[i].onmouseover = () => {
            if (i < primeuser) {
                console.log(users[i]._id);
                userList[i].className = "tooltip";
                div.innerHTML = "<p>" + users[i].email + "</p>";
                userList[i].appendChild(div);
            } else {
                console.log(users[i + 1]._id);
                userList[i].className = "tooltip";
                div.innerHTML = "<p>" + users[i + 1].email + "</p>";
                userList[i].appendChild(div);
            }
        };
    }
};