function findMovieUrl(){
	var iframe = document.querySelector('.movieWrapper > iframe');
	
	if(iframe === undefined || iframe === null) {
		// Couldn't find IFRAME inside .movieWrapper element
		throw new Error('Nie jesteś na stronie z filmem.');
	}
	
	iframe = iframe.contentDocument || iframe.contentWindow.document;
	var url = iframe.documentElement.innerHTML.match(/\'http:\/\/(.*)type\: \'video\//g);
	if(url === undefined || url === null) {
		// Silverlight
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
} catch(err) {
	result = {
		'movieUrl': null,
		'error': err.message
	}
	console.error(result.error);
} finally {
	chrome.runtime.sendMessage(result);
}

