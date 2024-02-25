// ===============================================================================
//  Code for COLORS  ==================================================================
// ===============================================================================

function getHtmlForColorInput(color) {
	if (!color) return '';
	const pickedColorCase = `<div class="colors-line main-color">
	<div><span><b>Picked color : </b></span>${getHTMLForColorItem(color)}  </div></div>`;

	const complementaryColorEl = `<div class="colors-line main-color">
	<div><span><b>Complementary color : </b></span>${getHTMLForColorItem(complementaryColor(color))}  </div></div>`;

	const pickedColorEl = ` ${pickedColorCase}${complementaryColorEl}`;

	let colorsEls = '';
	let lastColor = '';
	for (let i = -50; i <= 50; i += 10) {
		const s = shadeColor(color, i);
		if (lastColor !== s) {
			colorsEls += getHTMLForColorItem(s);
			lastColor = s;
		}
	}
	colorsEls = `<span><b>Shades : </b></span>
	<div class="colors-line shades-color"> ${colorsEls}  </div>`;

	return `${pickedColorEl} ${colorsEls}`;
}

function getHTMLForColorItem(color) {
	return `<div class="colorItem"  
					title="Copy value on click"
                    onclick="navigator.clipboard.writeText( this.innerHTML)"  
                    style="background-color: ${color}; color: ${getColorByBgColor(color)}"> 
                    ${color}
                </div>`;
}

function getWebSiteColors({ colors, fontColors, aditionalContent, pickedColor }) {
	console.log(pickedColor);
	let bkgColors = '';
	for (const key in colors) {
		bkgColors += getHTMLForColorItem(key);
	}

	let fontColorsRes = '';
	for (const key in fontColors) {
		fontColorsRes += getHTMLForColorItem(key);
	}

	const a = `<span><b>Site colors :</b></span>
                    <div class="colors-line shades-color">${bkgColors}</div>
                    <span><b>Fonts colors : </b></span>
                    <div class="colors-line shades-color">${fontColorsRes}</div>`;

	return encapsulateInPanel(aditionalContent + a, pickedColor);
}

//  Return appropriate color depending of the background color
// getColorByBgColor(#000000) return #fff
function getColorByBgColor(bgColor) {
	if (!bgColor) {
		return '#000';
	}
	return parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff';
}

// return clearer or darker color
const shadeColor = (col, amt) => {
	if (!col) return '#ffffff';
	col = col.replace(/^#/, '');
	if (col.length === 3) col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];

	let [ r, g, b ] = col.match(/.{2}/g);
	[ r, g, b ] = [ parseInt(r, 16) + amt, parseInt(g, 16) + amt, parseInt(b, 16) + amt ];

	r = Math.max(Math.min(255, r), 0).toString(16);
	g = Math.max(Math.min(255, g), 0).toString(16);
	b = Math.max(Math.min(255, b), 0).toString(16);

	const rr = (r.length < 2 ? '0' : '') + r;
	const gg = (g.length < 2 ? '0' : '') + g;
	const bb = (b.length < 2 ? '0' : '') + b;

	return `#${rr}${gg}${bb}`;
};

const complementaryColor = (hex) => {
	if (!hex) return;
	// Convert the hexadecimal color code to RGB

	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);

	// Invert the RGB values
	const invertedR = 255 - r;
	const invertedG = 255 - g;
	const invertedB = 255 - b;

	// Convert the RGB values to a hexadecimal color code
	const invertedHex = '#' + ((1 << 24) + (invertedR << 16) + (invertedG << 8) + invertedB).toString(16).slice(1);
	return invertedHex;
};
const rgbToHex = (rgb) => {
	if (!rgb) return '#ffffff';
	const [ r, g, b ] = rgb.match(/(\d{1,3})/g);
	const a = (r, g, b) => ((b | (g << 8) | (r << 16)) / 0x1000000).toString(16).substring(2);
	const res = '#' + (a(r, g, b) + '000000').slice(0, 6);
	return res;
};

function encapsulateInPanel(additionalContent, pickedColor = '#ffffff') {
	const fullContent = `<div class="ce-colors-panel">
	<div class='close-panel move-panel' onclick="document.querySelector('.CE-colors-panel').classList.toggle('topRight')">
		<img  src="${chrome.runtime.getURL('/icons/move.svg')}"  width="15" height="15"/>
	</div>
	<div class='close-panel' onclick="document.querySelector('.CE-colors-panel').remove()">
		<img  src="${chrome.runtime.getURL('/icons/close.svg')}"  width="20" height="20"/>
	</div>
	   ${additionalContent}
	  <div class="colors-line main-color" >
	  	<div class="color-picker-btn" ><img  src="${chrome.runtime.getURL('/icons/color.svg')}" width="20"/></div>
		<section style="margin:auto;">
			<div class="panel-picker color-picker btn-color-picker" title="Pick a color">
				<input  type='color'  value="${pickedColor}" id="color-picker"  
				style="color: ${getColorByBgColor(pickedColor)}" />
			</div>
		</section>
	</div>
	   </div>`;

	return fullContent;
}

function manageWebSiteColors({ colors, fontColors }) {
	let background = {};
	let fonts = {};

	for (let index = 0; index < colors.length; index++) {
		const element = colors[index];
		if (element !== '' && element !== 'rgba(0, 0, 0, 0)') {
			const c = rgbToHex(element);

			if (!background[c]) background[c] = 1;
			else background[c] += 1;
		}
	}
	for (let index = 0; index < fontColors.length; index++) {
		if (fontColors[index] !== '') {
			const d = rgbToHex(fontColors[index]);
			if (!fonts[d]) fonts[d] = 1;
			else fonts[d] += 1;
		}
	}

	background = Object.fromEntries(Object.entries(background).sort(([ , a ], [ , b ]) => b - a));
	fonts = Object.fromEntries(Object.entries(fonts).sort(([ , a ], [ , b ]) => b - a));

	return { colors: background, fontColors: fonts };
}
//   ==============================================================================
//  End Code for COLORS   ===============================================================
//   ==============================================================================
export {
	rgbToHex,
	shadeColor,
	getWebSiteColors,
	manageWebSiteColors,
	getColorByBgColor,
	complementaryColor,
	getHTMLForColorItem,
	getHtmlForColorInput
};
