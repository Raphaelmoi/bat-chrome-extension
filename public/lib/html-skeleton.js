const htmlSkeleton = (content, closeEvent) => `<div class="imageExtractorResContainer">
		<span class='close-panel move-panel' onclick="document.querySelector('.medias-count').classList.toggle('topRight')">
			<img  src="${chrome.runtime.getURL('/icons/move.svg')}"  width="15" height="15"/>
		</span>
		<span class='close-panel' onclick="document.querySelector('.medias-count').remove(); ${closeEvent}">
			<img  src="${chrome.runtime.getURL('/icons/close.svg')}"  width="20" height="20"/>
		</span>
		${content}
		</div>`;
