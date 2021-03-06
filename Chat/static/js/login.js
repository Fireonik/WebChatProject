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
      }, 2000);
      break;
    }
  }
}

function login(username, password) {
  function proceedToChat() {
    setTimeout(() => {
      window.location.href = '/chat';
    }, 2000);
  }
  let request = new XMLHttpRequest();
  request.open("POST", "/api/login", true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      response = JSON.parse(request.responseText)
      result = response.result
      switch (result) {
        case "Success": {
          changeLoadingState("success");
          token = response.token
          localStorage.setItem('token', token)
          console.log(token)
          proceedToChat()
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
  login(username, password)

  setTimeout(() => {
    changeLoadingState("initial");
  }, 4000);
  busy = false;

});
