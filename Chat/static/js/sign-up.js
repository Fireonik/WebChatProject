
function hidePreviousWarnings() {
  document.querySelector(".username-warning").classList.add("hidden");
  document.querySelector(".password-warning").classList.add("hidden");
  document.querySelector(".error-warning").classList.add("hidden");
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
        $state.html("Sign up");
      }, 2000);
      break;
    }
    case "loading": {
      $this.addClass("loading");
      $state.html("Signing up");
      break;
    }
    case "success": {
      setTimeout(() => {
        $this.addClass("ok");
        $state.html("Success!");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      }, 2000);
      break;
    }
  }
}
function signup(username, password) {
  let request = new XMLHttpRequest();
  request.open("POST", "/api/signup", true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      response = JSON.parse(request.responseText)
      result = response.result
      switch (result) {
        case "Success": {
          changeLoadingState("success");
          break;
        }
        case "User already exists": {
          username.value = "";
          document.querySelector(".username-warning").classList.remove("hidden");
          break;
        }
        case "Unexpected error while attemting to sign up": {
          password.value = "";
          document.querySelector(".password-warning").classList.remove("hidden");
          break;
        }
      }
    }
  }
  request.send(JSON.stringify({
    username: username.value,
    password: password.value
  }));
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

  signup(username, password)

  setTimeout(() => {
    changeLoadingState("initial");
  }, 4000);
  busy = false;

});
