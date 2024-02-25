// ===============================================================================
//   DOM destructor   ==================================================================
// ===============================================================================
let domRemoverEL = null;
/**
 * Launches the DOM destructor by initializing the event listeners and setting a timeout to check for the existence of the DOM element.
 * @function
 */
let tryCount = 500;
function launchDomDestructor() {
	setTimeout(() => {
		domRemoverEL = document.querySelector('.domRevomer');
		if (!domRemoverEL && tryCount > 0) {
			tryCount--;
			launchDomDestructor();
		} else if (tryCount <= 0) {
			console.log('tryCount reach limit');
		} else {
			initDOMDestructor();
		}
	}, 100);
}
launchDomDestructor();

/**
Initializes the DOM destructor feature by adding a click event listener to the DOM destructor element and toggling its active class.
When the element is active, it adds a mouseover event listener for focusing the target element, and a click event listener for destroying the DOM element.
When the element is not active, it removes the event listeners and the active class.
@function 
*/
function initDOMDestructor() {
	domRemoverEL.onclick = () => {
		domRemoverEL.classList.toggle('active');
		if (!domRemoverEL.classList.contains('active')) deleteEventDOMDesctuctor();
		else {
			document.addEventListener('mouseover', onHoverFocusTarget);
			document.addEventListener('click', destroyDOM, true);
		}
	};
}

/**
Removes the target of the click event from the DOM.
@function
@param {Event} event - The click event that triggered the function.
*/
function destroyDOM(event) {
	event.preventDefault();
	event.stopPropagation();

	if (!isChromeExtension(event)) {
		event.target.remove();
		deleteEventDOMDesctuctor();
	}
}

/**
Removes event listeners for the DOM destructor feature.
The function removes the 'mouseover' event listener for the onHoverFocusTarget() function and 'click' event listener for the destroyDOM() function.
Also, it removes the active class from the .domRevomer element
*/
function deleteEventDOMDesctuctor() {
	document.removeEventListener('mouseover', onHoverFocusTarget);
	document.removeEventListener('click', destroyDOM, true);
	const domRemoverEL = document.querySelector('.domRevomer');
	domRemoverEL.classList.remove('active');
}

/**
@function onHoverFocusTarget
@param {MouseEvent} event - The event object
Add the class 'focusToDelete' to the hovered element and remove the class from any previously hovered element.
Will not add the class if the hovered element is part of the chrome extension.
*/
function onHoverFocusTarget(event) {
	document.querySelectorAll('.focusToDelete').forEach((element) => {
		element.classList.remove('focusToDelete');
	});
	if (!isChromeExtension(event)) event.target.classList.add('focusToDelete');
}
