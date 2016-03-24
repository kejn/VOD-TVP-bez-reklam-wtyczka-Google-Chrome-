// This function is called onload in the popup code
function getMovieUrl(callback) {
		chrome.tabs.executeScript(null, { file: 'content.js' });
		chrome.runtime.onMessage.addListener(function(message) {
			callback(message);
		});			
}; 
