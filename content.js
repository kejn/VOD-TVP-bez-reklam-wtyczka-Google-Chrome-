function findMovieUrl(){
  var result;
    var wrapper = document.querySelector('.playerContainer iframe').contentDocument;
    if (wrapper) {
      var player = wrapper.querySelector('iframe').contentDocument;
      result = searchInIframe(player.documentElement.innerHTML);
    }
  return result;
}

function searchInIframe(iframeContent) {
	var url = iframeContent.match(/\'https?:\/\/(.*)type\: \'video\//g);
	if(url === undefined || url === null) {
		console.error('Silverlight');
		throw new Error('Ta wtyczka nie generuje linków dla filmów obsługiwanych przez Silverlight');
	}
	url = url.toString().split("\'")[1];
	console.log('Url: ' + url);
	return {
    'movieUrl': url,
	'error': null,
    'title': url
	};
}

var result;

try {
	result = findMovieUrl();
	chrome.runtime.sendMessage(result);
} catch(err) {
	try {
		if(err.message.indexOf('src') != 0) {
			throw err;
		}
		console.log('sending cross domain origin request');
		var iframeSource = err.message.split(';')[1];
		var request = new XMLHttpRequest();
		request.open('GET',iframeSource);
		request.responseType = 'text';
		request.onreadystatechange = function() {
			if (request.readyState==4 && request.status==200)
        {
					var remoteIframeContent = request.responseText;
					result = searchInIframe(remoteIframeContent);
					chrome.runtime.sendMessage(result);
        }
		}
		request.send();
	} catch(err2) {
		result = {
			'movieUrl': null,
			'error': err2.message
		}
		console.error(result.error);
		chrome.runtime.sendMessage(result);
	}
}

