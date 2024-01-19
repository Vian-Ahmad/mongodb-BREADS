function onDelete(usersid, title) {
    document.getElementById("notification").style.display = "block";
    document.getElementById("btn-yes").setAttribute("href", `users/delete/${usersid}`);
    return false
  }
  
  function cancleDelete() {
    document.getElementById("notification").style.display = "none";
  }


  function onUpdate(usersid, title) {
    document.getElementById("notification-update").style.display = "block";
    document.getElementById("btn-submit").setAttribute("href", `users/delete/${usersid}`);
    return false
  }
  
  function cancleUpdate() {
    document.getElementById("notification-update").style.display = "none";
  }