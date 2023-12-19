window.onload = () => {
  // ======================================== TO DO APP ========================================

  //-------------------- GET USER DATA FROM LOCAL STORAGE
  let loginUserFName = localStorage.getItem("userName");
  let userEmail = localStorage.getItem("email");
  let userPassword = localStorage.getItem("password");
  let userID = localStorage.getItem("id");

  console.log("userName: " + loginUserFName);
  console.log("email: " + userEmail);
  console.log("userID: " + userID);

  // --------- user greeting
  welcomeUserMSG = (loginUserFName, userEmail) => {
    let welcomeMSG = document.querySelector("#welcome-user-message");
    //console.log(loginUserFName, userEmail);
    welcomeMSG.innerHTML = ` Welcome, ${loginUserFName}, ${userEmail}  `;
  };

  welcomeUserMSG(loginUserFName, userEmail);

  // --------- CALCULATE TIME REMAINING UNTIL DEADLINE

  const currentTime = new Date();

  function getTimeRemaining(deadline) {
    const deadlineDate = new Date(deadline);

    // Calculate the time difference in milliseconds
    const timeDiff = deadlineDate - currentTime;

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    

    // Calculate weeks and months
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30); // Assuming a month is 30 days for simplicity

    return {
      days,
      hours,
      minutes,      
      weeks,
      months,
    };
  }

  // ---------------------------------------- SHOW ADD FORM ---------------------------------------

  document
    .getElementById("addNewDoActivity")
    .addEventListener("click", (event) => {
      event.preventDefault();
      let formContainer = document.getElementById("form-container");

      // Check if the form is already added
      if (!document.getElementById("form-doing")) {
        // Form content
        let formContent = `
                <form id="form-doing">
                    <legend>TYPE:</legend><br>
                    <input type="radio" id="work" class="work" name="type" value="work">
                    <label for="work">WORK</label>
                    <input type="radio" id="personal" name="type" value="personal">
                    <label for="personal">PERSONAL</label>
                    <input type="radio" id="study" name="type" value="study">
                    <label for="study">STUDY</label><br><br>
                    <hr>
                    <label for="do-content-input">✍️</label>
                    <input type="text" id="do-content-input" name="content" placeholder="what to do" style="width: 100px;" /><br>
                    <hr>
                    <label for="do-endDate-input">📅 </label>
                    <input type="datetime-local" id="do-endDate-input" name="endDate" placeholder="endDate" /><br>
                    <hr>
                    <button id="form-doing-SubmitButton" type="submit">SUBMIT</button>
                </form>
            `;

        // Add the form to the container
        formContainer.innerHTML = formContent;
      }

      // Always set the style to "block" on each click
      formContainer.style.display = "block";

      // Event listener for form submission
      document
        .getElementById("form-doing")
        .addEventListener("submit", handleFormSubmission);
    });

  // ---------------------------------------- CREATE/UPLOAD ---------------------------------------
//Get User Data from form
  function getUserInputFromForm() {
    let type = document.querySelector('input[name="type"]:checked')?.value;//the value of checked radio button

    let content = document.getElementById("do-content-input").value;//value of message input
    let deadline = document.getElementById("do-endDate-input").value;//value of deadline

    if (!type) {
      alert("Please select a type (Work, Personal, or Study).");
      return null;
    }

    if (!content.trim()) {
      alert("Please enter content for the activity.");
      return null;
    }

    if (!deadline.trim()) {
      alert("Please enter a deadline for the activity.");
      return null;
    }

    return {
      type: type,
      content: content,
      deadline: deadline,
    };
  }


  function createJsonData(userId, userInput) {
    return {
      userId: userId,
      type: userInput.type,
      content: userInput.content,
      endDate: userInput.deadline,
    };
  }

  function sendNewActivityToBackend(newActivityData) {//(activity=task)
    return fetch("https://localhost:7171/api/ToDo", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newActivityData),
    });
  }

  function handleFormSubmission(event) {
    event.preventDefault();

    let userInput = getUserInputFromForm();

    if (userInput) {
      let newActivityData = createJsonData(userID, userInput);

      sendNewActivityToBackend(newActivityData)//fetch
        .then((response) => response.json())
        .then((result) => {
          console.log("Activity was created successfully");
          // Call showAllActivities to update the list on web
          fetchAndShowActivities();//fetch - get all
        })
        .catch((error) => console.log(error));
    }
  }

  // Function to handle fetch errors
  function handleFetchError(error) {
    console.log("Error fetching data:", error);
  }

  // Function to fetch and show all activities
  function fetchAndShowActivities() {
    fetch("https://localhost:7171/api/ToDo", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        // Clear the existing content before showing new activities
        document.getElementById("DisplayAllTasks").innerHTML = "";

        showAllActivities(result);//call a method to show result.foreach
      })
      // .then(showAllActivities)//cia reiktu issisaugoti i (globalu) kintamaji naudoti web'e, ir ji naudoti funkcijose, nepersiunciant is naujo is backend'o
      .catch(handleFetchError);
  }

  // Initial fetch and show all activities
  fetchAndShowActivities();

//show all activities on web (no fetch)
  function showAllActivities(result) {
    let AllTasksDisplay = document.getElementById("DisplayAllTasks");
    let individualTasks = result.filter((task) => task.userId === userID);//show only the tasks of the logged in user

    individualTasks.forEach((task) => { //for each task, generate new div
      let remainingTime = getTimeRemaining(task.endDate);

      AllTasksDisplay.innerHTML += `
        <div class="individual">
            <div class="${task.type}">            
                <a class="${task.type}">TYPE: ${task.type}</a> <a>ID: ${task.id}</a><br>
                <a>✍️: ${task.content}</a><br>
                <a>📅 ${task.endDate}</a><br>
                <a>📅 Remaining time ${formatRemainingTime(
                  remainingTime)}</a><br>
                <a><button class="updateTaskBtn" id="${task.id}"> UPDATE</button><a>
                <a><button class="deleteTaskBtn" id="${task.id}"> DELETE</button></a>
                <br>
            </div>
        </div>`;
    });

    // ---------------------------------------- DELETE BUTTON ----------------------------------------
    document.querySelectorAll(".deleteTaskBtn").forEach((deleteBtn) => {//generate delete button for every dynamically shown div
      deleteBtn.addEventListener("click", () => {
        let taskId = deleteBtn.getAttribute("id");
        if (confirm("Are you sure you want to delete this task?")) {
          deleteTaskById(taskId);//call delete method
        }
      });
    });

    // ---------------------------------------- UPDATE BUTTON ----------------------------------------
    document.querySelectorAll(".updateTaskBtn").forEach((updateTaskBtn) => {//generate update button for every dynamically shown div
      updateTaskBtn.addEventListener("click", () => {
        let taskId = updateTaskBtn.getAttribute("id");
        // let task = {};
        fetch(`https://localhost:7171/api/ToDo/${taskId}`) //fetch single task that was clicked
          .then((response) => response.json())
          .then((result) => {
            console.log(result.id, result.type, result.content, result.endDate);
            updateTaskById(//call update method and pass the properties from back end
              result.id,
              result.type,
              result.content,
              result.endDate
            );
          });

        // updateTaskById(task.id,task.type, task.content, task.deadline);
      });
    });
  }
  //--------- END of showAllActivities function

  function deleteTaskById(taskId) {
    fetch(`https://localhost:7171/api/ToDo/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error deleting task with ID ${taskId}`);
        }
        console.log(`Task with ID ${taskId} was deleted successfully`);
        location.reload();
      })
      .catch((error) => console.error(error));
  }

  // ---------------------------------------- UPDATE ----------------------------------------
  //UPDATE - METODE NEREIKIA GRAZINTI JSON, KAIP IR REGISTRACIJOJ
  function updateTaskById(taskId, type, content, deadline) {
    console.log(`updating post with id ` + taskId);

    let updateBtn = document.getElementById(`updateTaskBtn`);
    let whatToUpdate = prompt("What to change?:", content);

    if (whatToUpdate === null) {
      console.log(`User clicked Cancel`);
      return;
    }
    //date from backend updated with parameter from prompt
    let updateJSON = {
      userId: userID,
      type: type,
      content: whatToUpdate, // User input here
      endDate: deadline,
      id: taskId,
    };

    console.log(updateJSON);

    //put the updated JSON back to backend
    fetch(`https://localhost:7171/api/ToDo/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updateJSON),
    })
      .then()
      .then((result) => {
        console.log("task was updated successfully");
        //refresh load page
        location.reload();
      })
      .catch((error) => console.log(error));
  }

  // ======================================== FORM ========================================
  // ======================================== OTHER ========================================

  function formatRemainingTime(remainingTime) {
    const { days, hours, minutes} = remainingTime;
    let formattedTime = "";
    if (days > 0) {
      formattedTime += `${days} days `;
    }
    if (hours > 0 || days > 0) {
      formattedTime += `${hours} hours `;
    }
    if (minutes > 0 || hours > 0 || days > 0) {
      formattedTime += `${minutes} minutes `;
    }
       return formattedTime;
  }
}; // <- end of window.onload

//================================================ END