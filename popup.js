/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
		var VOD_TVP_URL = 'vod.tvp.pl';
    console.assert(typeof url == 'string', 'tab.url should be a string');
		if(url.indexOf(VOD_TVP_URL) < 0) {
			renderStatus('Nie jesteś na stronie http://' + VOD_TVP_URL + '/', true, true);
			return;
		}
    callback(url);
  });
}

function renderStatus(statusText, error, reset) {
  document.getElementById('text').textContent = statusText;
  console.log(statusText);
	if(error === true) {
		chrome.browserAction.setIcon({path:'icon_error.png'});
		document.getElementById('text').style.color = 'red';
	}
	if(reset === true) {
		setTimeout(function() {
			chrome.browserAction.setIcon({path:'icon.png'});
			setTimeout(function() {
				window.close();
			}, 10);
		}, 3500);
	}
}

function onPageDetailsReceived(pageDetails)  {
		if(pageDetails.error) {
			renderStatus(pageDetails.error, true, true);
			return;
		}
		renderStatus('Kliknij poniższy link aby oglądać bez reklam :)')
		var movieLink = document.querySelector('#movie');
		movieLink.href = pageDetails.movieUrl;
		movieLink.innerHTML = pageDetails.movieUrl;
		movieLink.style.display = 'inline';
		movieLink.addEventListener("click", function(){
			chrome.browserAction.setIcon({path:'icon.png'});
			chrome.tabs.create({'url': pageDetails.movieUrl});
		}, false);
		chrome.browserAction.setIcon({path:'icon_success.png'});
} 


document.addEventListener('DOMContentLoaded', function() {
	getCurrentTabUrl(function(url) {
		renderStatus('Szukam filmu na stronie...');
		chrome.runtime.getBackgroundPage(function(eventPage) {
				console.log('getBackgroundPage()');
        eventPage.getMovieUrl(onPageDetailsReceived);
    });
	});
});
