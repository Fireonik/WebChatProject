let busy = false;

$(".login").on("submit", function (e) {
  e.preventDefault();
  if (busy) return;
  document.querySelector(".username-warning").classList.add("hidden");
  document.querySelector(".password-warning").classList.add("hidden");
  document.querySelector(".error-warning").classList.add("hidden");
  const username = document.querySelector(`input[type="text"]`);
  const password = document.querySelector(`input[type="password"]`);

  if (username.value.length === 0) {
    username.focus();
    return;
  } else if (password.value.length === 0) {
    password.focus();
    return;
  }

  busy = true;
  let $this = $(this),
    $state = $this.find("button > .state");
  $this.addClass("loading");
  $state.html("Signing up");

  if (password.value.length < 8 || password.value.length > 50) {
    setTimeout(() => {
      $this.removeClass("loading");
      $state.html("Sign up");
      password.value = "";
      document.querySelector(".password-warning").classList.remove("hidden");
      busy = false;
      return;
    }, 1000);
  } else {
    const socket = io();
    socket.emit("signUp", {
      username: username.value,
      password: password.value,
    });
    socket.on("signUpResult", (data) => {
      if (data === "Sign up successful") {
        setTimeout(function () {
          $this.addClass("ok");
          $state.html("Success!");
          setTimeout(function () {
            $state.html("Sign up");
            $this.removeClass("ok loading");
            busy = false;
            window.location.href = "/login.html";
          }, 2000);
        }, 2000);
      } else if (data === "User already exists") {
        setTimeout(() => {
          $this.removeClass("loading");
          $state.html("Sign up");
          password.value = "";
          document
            .querySelector(".username-warning")
            .classList.remove("hidden");
          busy = false;
          return;
        }, 1000);
      } else {
        setTimeout(() => {
          $this.removeClass("loading");
          $state.html("Sign up");
          password.value = "";
          document.querySelector(".error-warning").classList.remove("hidden");
          busy = false;
          return;
        }, 1000);
      }
    });
  }
});
