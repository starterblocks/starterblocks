const {__} = wp.i18n;

import './editor.scss'
import './shares'
import {ModalManager} from './templates/ModalManager';
import TemplatesListModal from './templates/TemplatesListModal';

window._wpLoadBlockEditor.then( function( editor ) {
    appendImportButton(editor);
});

function appendImportButton(editor) {
    let node = document.querySelector('.edit-post-header-toolbar');
    if (!node) {
        setTimeout(function(){ appendImportButton(editor); }, 500);
        return;
    }
    let newElem = document.createElement('div');
    let html = '<div class="starterblocks-import-collection-btn-container">';


    html += `<button id="starterblocksImportCollectionBtn" title=${__("StarterBlocks")}>` + starterblocks_admin.icon + ` ${__("Library")}</button>`;
    html += '</div>';
    newElem.innerHTML = html;
    node.appendChild(newElem);
    document.getElementById("starterblocksImportCollectionBtn").addEventListener("click", starterblocksImportCollection);
}

function starterblocksImportCollection() {
    ModalManager.open(<TemplatesListModal rowClientId={false}/>);
}
