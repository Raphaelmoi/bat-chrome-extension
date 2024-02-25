// ===============================================================================
// detruire event quand on ferme myBubbles ou changement de picker
// ===============================================================================
// bugs recuperation du logo
// https://www.lemonde.fr/
//  bug le verre de vin bbalise ::before ::after
// https://www.chablis.fr/
// symbole et use
// franceinter
// https://lights.lu/
const mediasNumberClassNameBase = 'medias-count';
const mediasNumberClassName = '.' + mediasNumberClassNameBase;

// Delayed , waiting container to be ready
let tryCountT = 500;
function initMediaExtractor() {
	console.log(tryCountT);
	setTimeout(() => {
		const mediaExtractorEL = document.querySelector('.media-extractor');
		if (!mediaExtractorEL && tryCountT > 0) {
			tryCountT--;
			initMediaExtractor();
		} else if (tryCountT <= 0) {
			console.log('tryCountT reach limit');
		} else {
			mediaExtractorEL.onclick = () => {
				mediaExtractorEL.classList.toggle('active');
				if (!mediaExtractorEL.classList.contains('active')) resetAll();
				else {
					document.addEventListener('mouseover', onHoverPreSelect);
					document.addEventListener('click', onClickPickMedias, true);
				}
			};
		}
	}, 100);
}
initMediaExtractor();

/**
 * Handles the click event for media picker
 * @param {Event} event - Click event
 */
function onClickPickMedias(event) {
	event.preventDefault();
	event.stopImmediatePropagation();
	event.stopPropagation();
	deleteMediaPickerEvents();
	if (isChromeExtension(event)) return;
	// mediasEls =  all the medias of the selected item OR all medias from the page if the target was empty
	let mediasEls = mediaExtractor(event.target);
	if (!mediasEls.length) {
		mediasEls = mediaExtractor(document.body);
	}
	const mediasHTMLGrid = feedPanelWithResults(mediasEls);
	createMediasPanel(mediasHTMLGrid, 'full-aside');
}

/**
 * Feeds a HTML panel of videos and images with media elements 
 * @param {Array} [medias=[]] - Array of media element objects
 * @return {string} - HTML string for the panel
 */
function feedPanelWithResults(medias = []) {
	let videosResult = '';
	let imagesResult = '';
	medias.forEach((el) => {
		if (el.type === 'video') {
			if (videosResult === '') videosResult = `<p><b>Videos</b></p>`;
			videosResult += createDomMediaElement(el, 'video');
		} else {
			if (imagesResult === '') imagesResult = `<p><b>Images</b></p>`;
			imagesResult += createDomMediaElement(el, 'img');
		}
	});

	return htmlSkeleton(`${videosResult} ${imagesResult}`, 'resetAllAndClose()');
}

/**
 * Create a DOM media element contained in a .selectedImgPreview className
 * @param {Object} mediaEl - Object containing the media element properties
 * @param {string} mediaEl.src - Source of the media element
 * @param {string} mediaEl.extension - Extension of the media element
 * @param {string} type - Type of the media element ('img' or 'video')
 * @return {string} - HTML string for the media element
 */
function createDomMediaElement(mediaEl, type) {
	let typeEl = '';
	const videoEvents =
		type === 'video'
			? `onmouseover="this.querySelector('video').play()"  onmouseleave="this.querySelector('video').pause();"`
			: '';
	if (type === 'img') {
		typeEl = `<img  src="${mediaEl.src}"
						  alt=""  
						  onerror="this.parentElement.style.display= 'none', this.onerror=null"  
						  onload="if(this.naturalWidth <= 1 && this.naturalHeight <= 1) this.parentElement.style.display='none' "/> `;
	} else {
		typeEl = `<video  src="${mediaEl.src}"  muted ></video>`;
	}
	return `<div class="selectedImgPreview" ${videoEvents} >
		${typeEl}
		<div>
			<span> ${mediaEl.extension}</span>
			<a  href="${mediaEl.src}"  target="_blank" >
				<img  src="${chrome.runtime.getURL('/icons/new-tab.svg')}"  width="20" height="20"/>
			</a>
			<a href="${mediaEl.src}"  download >
				<img  src="${chrome.runtime.getURL('/icons/download.svg')}"  width="20" height="20"/>
			</a>
		</div>
	</div>`;
}

/**
 * Handles the hover event for media pre-selection.
 * Delete the focusToDelete class for all elements and add it to focus one.
 * Display a small panel counting the qty of founded medias
 * @param {Event} event - Hover event
 */
function onHoverPreSelect(event) {
	if (!event) return;
	deleteFocussedClass();
	if (event.target && !isChromeExtension(event)) {
		event.target.classList.add('focusToDelete');
		const numberOfMedias = mediaExtractor(event.target).length;
		if (numberOfMedias > 0) {
			createMediasPanel(numberOfMedias + ' medias found');
		} else {
			createMediasPanel('Find all medias');
		}
	}
}
/**
 * Extracts background images from an element and its children
 * @param {HTMLElement} element - The element to extract background images from
 * @returns {Array} - An array of objects containing the image type, source, and extension
 */
function extractBackgroundImages(element) {
	const srcList = [];
	// ajouter recuperation des style inline
	Array.from(element.querySelectorAll('*')).forEach((el) => {
		const elementStyle = window.getComputedStyle(el);
		if (elementStyle) {
			const after = window.getComputedStyle(el, ':after').backgroundImage;
			const before = window.getComputedStyle(el, ':before').backgroundImage;
			const allBkg = elementStyle.backgroundImage + after + before;

			// console.log('all background');
			// console.log(allBkg);
			// console.log(after);
			// console.log(before);
			const inlineStyle = element.style.backgroundImage;
			if (inlineStyle) console.log('inlineStyle ' + inlineStyle);

			if (allBkg) {
				const backgroundColors = allBkg;
				const URLs = extractBackgroundImageURLs(backgroundColors);

				URLs.forEach((imageUrl) => {
					if (imageUrl && imageUrl !== '') {
						const isNotDoublon = srcList.findIndex((src) => src.src === imageUrl) === -1;
						if (isNotDoublon) {
							if (getFileExtension(imageUrl) === '' && imageUrl.includes('image/svg+xml')) {
								let cleanUrl = decodeURI(imageUrl.split(',')[1]);
								cleanUrl = cleanUrl.replace(/fill='%23([^']*)'/g, "fill='#$1'");
								cleanUrl = cleanUrl.replace(/fill="%23([^"]*)"/g, 'fill="#$1"');
								console.log(cleanUrl);
								const svgBlob = new Blob([ cleanUrl ], { type: 'image/svg+xml' });
								const objectURL = URL.createObjectURL(svgBlob);

								srcList.push({
									type: 'img',
									src: objectURL,
									extension: 'bkgSvg'
								});
							} else {
								srcList.push({
									type: 'img',
									src: imageUrl,
									extension: getFileExtension(imageUrl)
								});
							}
						}
					}
				});
			}
		}
	});
	return srcList;
}

function extractMediasDOMElements(targetEl) {
	const selector = (el) => el + ':not(.' + CE_classname + ' ' + el + ')';
	const srcList = [];

	const getAllMediasElements = targetEl.querySelectorAll(
		`${selector('img')}, ${selector('video')}, ${selector('svg')}, ${selector('video source')}  `
	);
	// console.log(`${selector('img')}, ${selector('video')}, ${selector('svg')}, ${selector('video source')} `);
	// console.log(getAllMediasElements);
	const getAllPlusSelf = [ targetEl, ...getAllMediasElements ];

	for (const mediaItem of getAllPlusSelf) {
		const type = mediaItem.tagName.toLowerCase();
		// à améilorer
		if (mediaItem.srcset && mediaItem.srcset !== '' && !mediaItem.src) {
			mediaItem.src = mediaItem.srcset.split(' ')[0];
		}

		if (mediaItem.src && mediaItem.src !== '') {
			if ((type === 'img' || type === 'video' || type === 'source') && !mediaItem.src.startsWith('blob:')) {
				const isNotDoublon = srcList.findIndex((existing) => existing.src === mediaItem.src) === -1;

				if (isNotDoublon) {
					if (getFileExtension(mediaItem.src) === '') {
						console.log('no extension for ');
						console.log(mediaItem);
					}
					srcList.push({
						type: type === 'source' ? 'video' : type,
						src: mediaItem.src,
						extension: getFileExtension(mediaItem.src)
					});
				}
			}
		} else if (type === 'svg') {
			if (mediaItem.querySelector('symbol')) {
				console.log('symbol svg');
				const symbolItems = mediaItem.querySelectorAll('symbol');
				symbolItems.forEach((symbolItem) => {
					const svgNS = 'http://www.w3.org/2000/svg';
					const rect = document.createElementNS(svgNS, 'svg');
					rect.setAttributeNS(null, 'viewBox', symbolItem.attributes.viewBox.value);
					rect.innerHTML = symbolItem.innerHTML;
					rect.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
					const svgBlob = new Blob([ rect.outerHTML ], { type: 'image/svg+xml' });
					const objectURL = URL.createObjectURL(svgBlob);
					// const isNotDoublon = srcList.findIndex((el) => el.size && el.size === svgBlob.size) === -1;
					// if (isNotDoublon) {
					srcList.push({ type, src: objectURL, extension: 'SymbolSVG', size: svgBlob.size });
					// }
				});
			} else if (mediaItem.querySelector('use')) {
				const useElement = mediaItem.querySelector('use');
				const getElId = extractId(useElement.href.baseVal);
				if (getElId && document.querySelector(getElId)) {
					const matchingSymbol = document.querySelector(getElId);
					if (matchingSymbol.attributes.viewBox) {
						mediaItem.setAttribute('viewBox', matchingSymbol.attributes.viewBox.value);
					}
					mediaItem.appendChild(matchingSymbol);
					mediaItem.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
					const svgBlob = new Blob([ mediaItem.outerHTML ], { type: 'image/svg+xml;charset=utf-8' });
					const svgUrl = URL.createObjectURL(svgBlob);
					console.log(svgUrl);
					const isNotDoublon =
						srcList.findIndex((el) => el.extension === 'UseSVG' && el.size && el.size === svgBlob.size) ===
						-1;
					if (isNotDoublon) {
						srcList.push({ type, src: svgUrl, extension: 'UseSVG', size: svgBlob.size });
					}
				}
			} else {
				mediaItem.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
				const svgBlob = new Blob([ mediaItem.outerHTML ], { type: 'image/svg+xml' });
				const objectURL = URL.createObjectURL(svgBlob);
				const isNotDoublon = srcList.findIndex((el) => el.size && el.size === svgBlob.size) === -1;
				if (isNotDoublon) {
					srcList.push({ type, src: objectURL, extension: 'SVG', size: svgBlob.size });
				}
			}
		}

		//  else if (type === 'use' && mediaItem.href && mediaItem.href.baseVal) {
		// 	fetch(mediaItem.href.baseVal).then((res) => {
		// 		console.log(res.url);
		// 		if (res.url) {
		// 			const isNotDoublon = srcList.findIndex((isn) => isn.src === res.url) === -1;
		// 			if (isNotDoublon) {
		// 				srcList.push({ type, src: res.url, extension: 'SVG' });
		// 			}
		// 		}
		// 	});
		// }
	}
	console.log(srcList);
	return srcList;
}

function extractId(string) {
	const parts = string.split('#');
	if (parts.length > 1) {
		return '#' + parts[parts.length - 1];
	} else {
		return null;
	}
}

function mediaExtractor(targetEl) {
	const backgroundList = extractBackgroundImages(targetEl);
	const mediasList = extractMediasDOMElements(targetEl);
	console.log(backgroundList);
	console.log(mediasList);
	let extractionResult = [ ...backgroundList, ...mediasList ];
	console.log(extractionResult);
	return extractionResult;
}

function getFileExtension(fileName) {
	const acceptedExtensions = [ 'jpg', 'jpeg', 'png', 'webp', 'svg', 'mp4' ];
	const t = fileName.substring(fileName.lastIndexOf('.') + 1);
	if (t && acceptedExtensions.find((el) => el === t.toLowerCase())) return t;
	return '';
}

function createMediasPanel(content, optionalClassName = '') {
	if (document.querySelector(mediasNumberClassName)) {
		document.querySelector(mediasNumberClassName).innerHTML = content;
	} else {
		const span = document.createElement('span');
		span.classList.add(mediasNumberClassNameBase);
		span.innerHTML = content;
		document.body.appendChild(span);
	}

	if (optionalClassName !== '') document.querySelector(mediasNumberClassName).classList.add(optionalClassName);
}

/**
 * Removes the event listeners added by the media picker
 */
function deleteMediaPickerEvents() {
	document.removeEventListener('mouseover', onHoverPreSelect);
	document.removeEventListener('click', onClickPickMedias, true);
}
/**
 * Deletes the media element panel from the DOM
 */
function deleteMediasPanel() {
	const mediasQtyEl = document.querySelector(mediasNumberClassName);
	if (mediasQtyEl) mediasQtyEl.remove();
}
/**
 * Removes the "focusToDelete" class from all elements that have it.
 */
function deleteFocussedClass() {
	document.querySelectorAll('.focusToDelete').forEach((element) => {
		element.classList.remove('focusToDelete');
	});
}
function resetAll() {
	deleteFocussedClass();
	deleteMediasPanel();
	deleteMediaPickerEvents();
}

function resetAllAndClose() {
	resetAll();
	document.querySelector('.ce-circle.media-extractor').classList.remove('active');
}
/**
 * Extracts the URLs of background images from a given string.
 * @param {string} string - The string to extract URLs from
 * @returns {string[]} - An array of image URLs
 */
function extractBackgroundImageURLs(string) {
	const regex = /url\(["'](.*?)["']\)/g;
	let match;
	const matches = [];
	while ((match = regex.exec(string)) !== null) {
		matches.push(match[1].replace(/["]/g, ''));
	}
	return matches;
}
