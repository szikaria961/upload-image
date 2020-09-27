function getImage() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) { //4 =request finished and response is ready
      var table = document.getElementById('table');
      table.innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", '/', true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
}

var uplaodBtn = document.getElementById('uplaod-btn');
uploadBtn.addEventListener('click', getImage);