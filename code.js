// window.onload = () => {
  // ---------------------------------   MENU  ---------------------------------
  let mainMenu = document.getElementById('userConnectContainer');
  let registerFormContainer = document.getElementById('form-register-container');
  let loginFormContainer = document.getElementById('form-login-container');
  
  // Event delegation for click events on mainMenu
  mainMenu.addEventListener('click', function (event) {
      if (event.target.id === 'registerSubmitButton') {
          
          console.log('Register form submitted');
          registerMethod();
      } else if (event.target.id === 'loginSubmitButton') {
         
          console.log('Login form submitted');
          loginMethod();
      }
  });
  
  document.getElementById('register').addEventListener('click', function () {
      // Hide login form and show register form
      // loginFormContainer.style.display = 'none';
  
      // Check if register form is already present
      let registerForm = mainMenu.querySelector('#register-form');
  
      if (!registerForm) {
          // Add the register form if it's not present
          mainMenu.innerHTML += `
            <div id="form-register-container">
              <fieldset>
                  <legend>REGISTER</legend>
                  <br>
                  <form id="register-form">
                      <label for="firstName"> First name:</label>
                      <br>
                      <input type="text" id="firstNameRegister" name="firstName" placeholder="vardenis" style="width: 100px;" />
                      <br>
                      <label for="lastName">Last Name:</label>
                      <br>
                      <input type="text" id="lastNameRegister" name="lastName" placeholder="pavardenis" />
                      <br>
                      <label for="password">Password:</label>
                      <br>
                      <input type="password" id="passwordRegister" name="password" placeholder="************" />
                      <br>
                      <label for="userEmail">Email</label>
                      <input type="email" id="userEmailRegister" name="userEmail" placeholder="test@exam.net" />
                      <br>
                      <button id="registerSubmitButton" >SIGN UP</button>
                      <br>
                  </form>
              </fieldset>
            </div>`;
      }
  });

  //kazko reikejo pasalinti "type="button"" is <button id="registerSubmitButton" type="button" >SIGN UP</button>
  
  document.getElementById('login').addEventListener('click', function () {
      // Hide register form and show login form
      registerFormContainer.style.display = 'none';
  
      // Check if login form is already present
      let loginForm = mainMenu.querySelector('#login-form');
  
      if (!loginForm) {
          // Add the login form if it's not present
          mainMenu.innerHTML += `
            <div id="form-login-container">
              <fieldset>
                  <legend>LOGIN</legend>
                  <br>
                  <form id="login-form">
                      <label for="firstName"> First name:</label>
                      <br>
                      <input type="text" id="firstNameLogin" name="firstName" placeholder="vardenis" style="width: 100px;" />
                      <br>
                      <label for="password">Password:</label>
                      <br>
                      <input type="password" id="passwordLogin" name="password" placeholder="************" />
                      <br>
                      <button id="loginSubmitButton" type="button">LOGIN</button>
                      <br>
                  </form>
              </fieldset>
            </div>`;
      }
  });
  


  // --------------------------------- REGISTER ---------------------------------
  function  registerMethod(event){
  document
    .getElementById(`register-form`)
    .addEventListener(`submit`, (event) => {
      // event.preventDefault();
      console.log(`registering`);
      let firstName = event.target.elements.firstName.value;
      let lastName = event.target.elements.lastName.value;
      let userFullName = firstName + ` ` + lastName;
      let userEmail = event.target.elements.userEmail.value;
      let userPassword = event.target.elements.password.value;

      //----------- create JSON
      // reikia nedeti kabuciu, nes pats veliau kvieciamas stringify metodas ta padaro
      //reikia kad struktura atitiktu backend

      let userData = {
        userName: firstName,
        email: userEmail,
        password: userPassword,
      };

      //----------- FETCH-PUT JSON
      fetch(
        "https://localhost:7171/api/Auth",

        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      )
        // .then(response => response.json()) //registracijai nereikia
        .then((result) => {
          console.log("user was registered successfully");
          //refresh load page
          location.reload();
        })
        .catch((error) => console.log(error));
    });
}
  // -------------------------------------------- LOGIN --------------------------------------------

  //-------------------- GET USER DATA FROM LOGIN FORM!

  function loginMethod(event) {
    // event.preventDefault();

    
    let firstNameLogin = document.getElementById("firstNameLogin").value;
    //let lastNameLogin = document.getElementById("lastNameLogin").value; //nereikia
    let passwordLogin = document.getElementById("passwordLogin").value;
    //let userEmailLogin = document.getElementById("userEmailLogin").value; //tik registracijai

    //-------------------- FETCH-GET FROM BACK-END
    //is FORMOS input.value
    let loginUrl = `https://localhost:7171/api/Auth?username=${firstNameLogin}&password=${passwordLogin}`;

    fetch(loginUrl, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {//jeigu backend suranda tai ka mes nusiunciam, tai ok, varom toliau
          return response.json();
        } else {
          alert(`wrong username or password`);
        }
      })
      .then((result) => {
        console.log(result);
        //-----------addToLocalStorage
        localStorage.setItem("userName", result.userName);
        localStorage.setItem("userName", result.userName);
        localStorage.setItem("password", result.password);
        localStorage.setItem("email", result.email);
        localStorage.setItem("id", result.id);

        window.location.href = `./toDoApp.html`;
      })
      .catch((error) => console.log(error));
  };
// }; // <- end of window.onload