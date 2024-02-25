import * as ColorPicker from './lib/color-picker.js';
import * as HtmlBase from './lib/html-base.js';

const CE_classname = 'extension-container';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	switch (request.message) {
		case 'getBaseContent':
			sendResponse({
				extensionClassName: CE_classname,
				html: HtmlBase.content
			});
		case 'getColorPickerData':
			sendResponse({
				textColor: ColorPicker.getColorByBgColor(request.color),
				htmlForColorInput: ColorPicker.getHtmlForColorInput(request.color)
			});
		case 'getWebSiteColors':
			sendResponse({ fullContent: ColorPicker.getWebSiteColors(request) });
		case 'manageExtractedColors':
			const { colors, fontColors } = ColorPicker.manageWebSiteColors({
				colors: request.bkgColors,
				fontColors: request.fontColors
			});
			sendResponse({ colors, fontColors });
		default:
			console.log('no matching response for ' + request.message);
			sendResponse({ error: ' did you set properly message ? ' });
			break;
	}
});
