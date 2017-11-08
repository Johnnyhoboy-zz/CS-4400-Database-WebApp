//Javascript function change button text color
function myFunction() {
	//This is how you declare variables and link to an html element like button
    var button = document.getElementById("myButton");
	
	//You can do logic like Java 
	if (button.style.color == "white")
		button.style.color = "black";
	else
		button.style.color = "white";
}

//Redirect webpages this way
function redirect() {
	window.location.href='views/nextPage.html';
}