function findMovieUrl(){
	var iframe = document.querySelector('.movieWrapper > iframe');
	
	if(iframe === undefined || iframe === null) {
		console.error('Couldn\'t find IFRAME inside .movieWrapper element');
		throw new Error('Nie jesteś na stronie z filmem.');
	}
	console.log(iframe.src);
	if(iframe.src.indexOf('vod.tvp.pl') < 0) {
		throw new Error('src;' + iframe.src);
	}
	var iframeContent = iframe.contentWindow.document || iframe.contentDocument ;
	return searchInIframe(iframeContent.documentElement.innerHTML);
}

function searchInIframe(iframeContent) {
	var url = iframeContent.match(/\'http:\/\/(.*)type\: \'video\//g);
	if(url === undefined || url === null) {
		console.error('Silverlight');
		throw new Error('Ta wtyczka nie generuje linków dla filmów obsługiwanych przez Silverlight');
	}
	url = url.toString().split("\'")[1];
	console.log('Url:\n\n' + url);
	return {
    'movieUrl': url,
		'error': null
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

