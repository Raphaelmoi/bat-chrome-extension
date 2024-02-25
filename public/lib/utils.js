const CE_classname = 'extension-container';
/**
 * Determines if a given event originates from the Chrome Extension.
 * @param {Event} event - The event to check
 * @returns {boolean} - true if the event originates from a Chrome Extension, false otherwise
 */
function isChromeExtension(event) {
	let element = event.target;
	let t = 10;
	while (t > 0 && element && element.classList) {
		if (element.classList.contains(CE_classname)) return true;
		element = element.parentNode;
		t--;
	}
	return false;
}
/**
@function sendMessage
@async
@param {Object} message - The message to send to the chrome extension.
@return {Promise<*>} - The response from the chrome extension.
*/
async function sendMessage(message) {
	const response = await chrome.runtime.sendMessage(message);
	return response;
}
