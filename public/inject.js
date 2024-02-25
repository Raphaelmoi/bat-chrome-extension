let variables = null;
let currentPickedColor = '#ffffff';

chrome.runtime.sendMessage({ message: 'getBaseContent' }, async (response) => {
	variables = response;
	console.log(variables);
	// ===============================================================================
	//  Inject base
	const chromeExtensionEl = document.createElement('div');
	chromeExtensionEl.classList.add(variables.extensionClassName);
	chromeExtensionEl.innerHTML = variables.html;
	document.body.appendChild(chromeExtensionEl);
	// ===============================================================================
	// Display the possible actions
	const bubble = document.querySelector('.myBubble');
	bubble.onclick = () => {
		document.querySelector('.' + variables.extensionClassName).classList.toggle('active');
	};
	// ===============================================================================
	// Event for color picker
	const colorPickerStart = document.querySelector('.color-picker');
	let hidePanel = true;
	colorPickerStart.addEventListener('click', async (event) => {
		hidePanel = !hidePanel;
		toggleColorPanel('', !hidePanel);
	});
});
// Toggle the management colors panel
async function toggleColorPanel(content, disable = false) {
	let panelColorEl = document.querySelector('.CE-colors-panel');
	if (disable && panelColorEl) {
		panelColorEl.remove();
		return;
	}
	let { colors, fontColors } = await extractColors();

	const { fullContent } = await sendMessage({
		message: 'getWebSiteColors',
		colors,
		fontColors,
		aditionalContent: `${content}`,
		pickedColor: currentPickedColor
	});

	if (!panelColorEl) {
		panelColorEl = document.createElement('div');
		panelColorEl.classList.add(variables.extensionClassName);
		panelColorEl.classList.add('CE-colors-panel');
		panelColorEl.innerHTML = fullContent;
		document.body.appendChild(panelColorEl);
	} else {
		panelColorEl.innerHTML = fullContent;
	}
	initColorPicker();
}
// On color picking
function initColorPicker() {
	const colorPickerEl = document.querySelector('.panel-picker #color-picker');

	colorPickerEl.addEventListener('input', async (event) => {
		if (event && event.target && event.target.value) {
			currentPickedColor = event.target.value;
			const a = await sendMessage({ message: 'getColorPickerData', color: event.target.value });
			toggleColorPanel(a.htmlForColorInput);
		}
	});
	const btnColorPicker = document.querySelector('.color-picker-btn');
	btnColorPicker.addEventListener('click', (ev) => initEyeDropper());

	initEyeDropper();
}
function initEyeDropper() {
	console.log('initEyeDropper');
	if (!window.EyeDropper) {
		resultElement.textContent = 'Your browser does not support the EyeDropper API';
		return;
	}
	const eyeDropper = new EyeDropper();
	eyeDropper
		.open()
		.then((result) => {
			sendMessage({ message: 'getColorPickerData', color: result.sRGBHex }).then((res) => {
				currentPickedColor = result.sRGBHex;
				toggleColorPanel(res.htmlForColorInput);
			});
		})
		.catch((e) => {
			console.log(e);
		});
}
// Extracts all the colors from the website excluding the chrome extenstion
// return {colors, fontColors} colors is for backgroundColor
async function extractColors() {
	let bkgColors = [];
	let fontColors = [];
	Array.from(document.body.querySelectorAll('*:not(.' + variables.extensionClassName + ' *)')).forEach((element) => {
		const elementStyle = window.getComputedStyle(element);
		bkgColors.push(elementStyle.backgroundColor);
		fontColors.push(elementStyle.color);
	});
	const a = await sendMessage({ message: 'manageExtractedColors', bkgColors, fontColors });
	return a;
}

// // ===============================================================================
