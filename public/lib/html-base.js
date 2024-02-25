const perfIcon = `<svg style="color: #000" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-speedometer2" viewBox="0 0 16 16"> <path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4zM3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.389.389 0 0 0-.029-.518z" fill="#000"></path> <path fill-rule="evenodd" d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A7.988 7.988 0 0 1 0 10zm8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3z" fill="#000"></path> </svg>`;
const deleteIcon = `<svg style="color: #000" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-expressionless" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" fill="#000"></path> <path d="M4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm5 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" fill="#000"></path> </svg>`;
const imgIcon = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><g><path d="M31.5,34.5v443h449v-443H31.5z M57.5,61.5h399v316.478l-57.26-99.177L323,146.747l-76.24,132.053l-23.813,41.246l-0.706-1.223L179.5,244.795l-42.741,74.029L98.264,385.5H57.5V61.5z"/><circle cx="139" cy="133" r="40.5"/></g></svg>`;
const penIcon = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
<metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
<g><path fill="#000" d="M694.4,201.1L215.1,680.4c-27.8,27.8-27.8,72.8,0,100.5c27.7,27.8,72.8,27.8,100.5,0l479.3-479.3L694.4,201.1z M666.9,173.7l-53.3-53.3c-1.5,1.1-2.9,2.1-4.3,3.5L130,603.1c-14.9,14.9-14.9,39.2,0,54.1c14.9,14.9,39.2,14.9,54.1,0l479.3-479.3C664.8,176.6,665.8,175.1,666.9,173.7z M821.3,328c-1.5,1.1-2.9,2.1-4.3,3.5L337.8,810.8c-14.9,14.9-14.9,39.2,0,54.1c14.9,14.9,39.2,14.9,54.1,0l479.3-479.3c1.3-1.3,2.4-2.8,3.5-4.2L821.3,328z"/><path d="M283.3,850.6c-153.1,0-131.2-131.2-131.2-131.2c-65.6,0-76.5-43.7-76.5-43.7L10,992.7l328-76.5C276.8,903,283.3,850.6,283.3,850.6z"/><path d="M959.8,154.1L843.2,37.5C803-2.8,737.7-2.8,697.5,37.5L646.9,88l262.3,262.3l50.5-50.5C1000.1,259.6,1000.1,194.3,959.8,154.1z"/></g>
</svg>`;

const content = `<div class="ce-circle-container">
<div class="myBubble"><img  src="${chrome.runtime.getURL('/icons/batman.svg')}"   width="45"/></div>
<div class="ce-circle  ce-circle-with-icon domRevomer" title="remove any element from the page" >
    <img  src="${chrome.runtime.getURL('/icons/hulk.svg')}"   width="30"/>
</div>
<div class="ce-circle ce-circle-font color-picker" title="Pick a color" >
    <img  src="${chrome.runtime.getURL('/icons/color.svg')}" width="30"/>
</div>
<div class="ce-circle  ce-circle-with-icon media-extractor">${imgIcon}</div>

</div>`;
// <div class="ce-circle ce-circle-font"  title="Pick a font" >F</div>
// <div class="ce-circle  ce-circle-with-icon">${penIcon}</div>
// <div class="ce-circle  ce-circle-with-icon">${perfIcon}</div>

export { content };
