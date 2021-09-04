function hidePreviousWarnings() {
  document.querySelector(".username-warning").classList.add("hidden");
  document.querySelector(".password-warning").classList.add("hidden");
}

function noInput(username, password) {
  if (username.value.length === 0) {
    // also gives user a hint
    username.focus();
    return true;
  } else if (password.value.length === 0) {
    password.focus();
    return true;
  }
}
function passwordIsTooShort(password) {
  if (password.value.length < 8 || password.value.length > 50) {
    password.value = "";
    document.querySelector(".password-warning").classList.remove("hidden");
    password.focus()
    return true;
  }
}
function changeLoadingState(desiredState) {
  let $this = $(".login");
  let $state = $this.find("button > .state");

  switch (desiredState) {
    case "initial": {
      setTimeout(() => {
        $this.removeClass("ok loading");
        $state.html("Log in");
      }, 2000);
      break;
    }
    case "loading": {
      $this.addClass("loading");
      $state.html("Logging in");
      break;
    }
    case "success": {
      setTimeout(() => {
        $this.addClass("ok");
        $state.html("Welcome!");
        setTimeout(() => {
          window.location.href = "/chat.html";
        }, 2000);
      }, 2000);
      break;
    }
  }
}


let busy = false;

$(".login").on("submit", function (e) {
  e.preventDefault();
  if (busy) return;
  hidePreviousWarnings();

  const [username, password] = [document.querySelector(`input[type="text"]`), document.querySelector(`input[type="password"]`)];
  
  if (noInput(username, password) || passwordIsTooShort(password)) return;
  busy = true;

  changeLoadingState("loading");

  const socket = io();

  socket.emit("logIn", { username: username.value, password: password.value });

  socket.on("logInResult", (result) => {
    switch (result) {
      case "Success": {
        changeLoadingState("success");
        break;
      }
      case "User does not exist": {
        username.value = "";
        document.querySelector(".username-warning").classList.remove("hidden");
        username.focus()
        break;
      }
      case "Wrong password": {
        password.value = "";
        document.querySelector(".password-warning").classList.remove("hidden");
        password.focus()
        break;
      }
    }
  });
  setTimeout(() => {
    changeLoadingState("initial");
  }, 4000);
  busy = false;

});
