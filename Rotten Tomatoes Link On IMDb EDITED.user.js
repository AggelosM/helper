// ==UserScript==
// @name        Rotten Tomatoes Link On IMDb
// @namespace   https://github.com/Ede123/userscripts
// @version     1.2.2
// @description Adds a direct link to the corresponding Rotten Tomatoes movie description page for every IMDb movie
// @icon        https://raw.githubusercontent.com/Ede123/userscripts/master/icons/Rotten_Tomatoes.png
// @author      Eduard Braun <eduard.braun2@gmx.de>
// @license     GPL-3.0+; http://www.gnu.org/copyleft/gpl.html
// @include     http://www.imdb.com/title/tt*
// @include     https://www.imdb.com/title/tt*
// @noframes
// @grant       GM_xmlhttpRequest
// ==/UserScript==

// get IMDb movie ID
var IMDbID_RegEx = /\/title\/(tt\d{7})\//;
var IMDbID = IMDbID_RegEx.exec(window.location.href)[1];


// function to add the Rotten Tomatoes button
var addButton = function(link) {
	// icon
	var RT_icon = document.createElement('img');
	// RT_icon.src = "http://www.rottentomatoes.com/favicon.ico";
	// RT_icon.src = "https://staticv2.rottentomatoes.com/static/images/icons/favicon.ico";
	// RT_icon.src = "https://rottentomatoes.com/static/images/icons/favicon.ico";
	RT_icon.src = "https://staticv2-4.rottentomatoes.com/static/images/icons/favicon.ico";
	RT_icon.width = RT_icon.height = 16;
	RT_icon.style.verticalAlign = "bottom";

	// link
	var RT_link = document.createElement('a');
	RT_link.target = "_blank";
	RT_link.href = link;

	RT_link.appendChild(RT_icon);

	// spacer
	var spacer = document.createElement('span');
	spacer.classList.add("ghost");
	spacer.textContent = "|";

	//add link to IMDb movie page
	var subtext = document.getElementsByClassName("subtext")[0];
	if (subtext) {
		subtext.appendChild(spacer);
		subtext.appendChild(RT_link);
	}
};

var json,stats,stats2,reviewCount,AverageRating;
// get Rotten Tomatoes movie alias from Rotten Tomatoes API
GM_xmlhttpRequest({
	method: "GET",
	url: "http://www.omdbapi.com/?apikey=6be019fc&tomatoes=true&i=" + IMDbID,
	onload: function(response) {
		json = JSON.parse(response.responseText);
		if (json && json.tomatoURL && json.tomatoURL != "N/A") {
			addButton(json.tomatoURL);
		}
		else if (json && json.Error) {
			console.log("Error: " + json.Error);
		}
    dataReady();
	}
});

function dataReady() {
console.log(json.tomatoURL);
///////////////////////////
var input=document.createElement("input");
input.type="button";
input.value="RottenTomatoes Info";
input.onclick = showAlert;
input.setAttribute("style", "font-size:18px;position:absolute;top:120px;right:40px;");
document.body.appendChild(input);
////////////////////////
var rt_url = json.tomatoURL
function do_request(url,callback,rating_node){
    console.log('do request',url,rating_node,callback);
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response){
        	var parser = new DOMParser();
            callback(parser.parseFromString(response.responseText,'text/html'),rating_node);}
    });
}

do_request(rt_url,function(dom,rating_node){
        console.log('rt callback');
        stats = dom.querySelector('#all-critics-numbers #scoreStats').getElementsByTagName('div')[1].getElementsByTagName('span')[1];
		stats2 = dom.querySelector('#all-critics-numbers #scoreStats').getElementsByTagName('div')[0]
        reviewCount = stats.innerHTML;
		AverageRating = stats2.innerHTML;
        AverageRating=AverageRating.split("</span>");
dataReady2();
});



function dataReady2() {
//console.log(stats);
//console.log(stats2);
//console.log(reviewCount);
//console.log(AverageRating[1]);
console.log("Rating: " + AverageRating[1] + " from " + reviewCount + " users.");
}

function showAlert()
{
    //alert(json.tomatoURL);
    //alert(stats);

    alert("Rating: " + AverageRating[1] + " from " + reviewCount + " critics.");
    //alert(reviewCount);
    //alert(AverageRating);

}
}