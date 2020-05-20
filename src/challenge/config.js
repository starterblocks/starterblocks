import {__} from '@wordpress/i18n'
import {animateScroll} from 'react-scroll';
import {dispatch, select} from '@wordpress/data';
const {setTourActiveButtonGroup, setImportingTemplate} = dispatch('starterblocks/sectionslist');
const {getPageData} = select('starterblocks/sectionslist');
import {ModalManager} from '~starterblocks/modal-manager';
import PreviewModal from '~starterblocks/modal-preview';
export default {
    initialSecondsLeft: 300,
    beginningStep: -1,
    totalStep: 8,
    list: [
        {
            selector: '[data-tut="tour__navigation"]',
            caption: __('Template Type Tabs', starterblocks.i18n),
            offset: {
                x: 0,
                y: 50,
                arrowX: 0,
                arrowY: -20
            },
            box: {
                width: 250
            },
            direction: 'top',
            content: () => (
                <div>
                    These are the different types of templates we have.
                    <ul>
                        <li>
                            <strong>Sections</strong> are the building blocks of a page. Each "row" of content on a page we consider a section.
                        </li>
                        <li><strong>Pages</strong> are, you guessed it, a group of multiple sections making up a page.
                        </li>
                        <li><strong>Collections</strong> are groups of pages that all follow a style or theme.
                        </li>
                        <li><strong>Saved</strong> are reusable blocks that you may have previously saved for later.
                        </li>
                    </ul>
                </div>
            )
        },
        {
            selector: '[data-tut="tour__filtering"]',
            caption: __('Sidebar', starterblocks.i18n),
            content: __('This area is where you can search and filter to find the right kind of templates you want.', starterblocks.i18n),
            direction: 'left',
            offset: {
                x: 40,
                y: 10,
                arrowX: -20,
                arrowY: 0
            },
            box: {
                width: 250,
                height: 130
            },
            action: () => {
                animateScroll.scrollToTop({
                    containerId: 'starterblocks-collection-modal-sidebar',
                    duration: 0,
                });
            },
        },
        {
            selector: '[data-tut="tour__filtering"]',
            caption: __('Plugins Filter', starterblocks.i18n),
            offset: {
                x: 40,
                y: 10,
                arrowX: -20,
                arrowY: 0
            },
            box: {
                width: 290,
                height: 185
            },
            content: () => (
                <div>
                    Some templates require certain plugins. You can filter or select those templates. Hint, if the text
                    is a <a href="#" className="missing-dependency">little orange</a>, you don't have that plugin
                    installed yet, but don't worry. StarterBlocks will help you with that too.
                </div>
            ),
            action: () => {
                animateScroll.scrollToBottom({
                    containerId: 'starterblocks-collection-modal-sidebar',
                    duration: 0,
                });
            },
            direction: 'left'
        },
        {
            selector: '[data-tut="tour__main_body"]',
            caption: __('Templates List', starterblocks.i18n),
            content: __('This area is where the templates will show up that match the filters you\'ve selected. You can click on many of them to preview or import them.', starterblocks.i18n),
            direction: 'left',
            offset: {
                x: 40,
                y: 10,
                arrowX: -20,
                arrowY: 0
            },
            box: {
                width: 250,
                height: 150
            },
            action: () => {
                animateScroll.scrollToTop({
                    containerId: 'starterblocks-collection-modal-sidebar',
                    duration: 0,
                });
                setTourActiveButtonGroup(null);
            }
        },
        {
            selector: '#modalContainer .starterblocks-single-item-inner:first-child',
            caption: __('Template Hover', starterblocks.i18n),
            content: __('When you hover over a template you can see via icons what plugins are required for this template. You can then choose to Preview or Import a design.', starterblocks.i18n),
            action: () => {
                ModalManager.closeCustomizer();
                const pageData = getPageData();
                if (pageData && pageData.length > 0) {
                    setTourActiveButtonGroup(pageData[0])
                }
            },
            direction: 'left',
            offset: {
                x: 40,
                y: 10,
                arrowX: -20,
                arrowY: 0
            },
            box: {
                width: 240,
                height: 169
            },
        },
        {
            selector: '.wp-full-overlay-sidebar',
            caption: __('Preview Dialog', starterblocks.i18n),
            content: __('This is the preview dialog. It gives more details about the template and helps you to see what you could expect the templates to look like.', starterblocks.i18n),
            action: () => {
                setTourActiveButtonGroup(null);
                setImportingTemplate(null);
                const pageData = getPageData();
                if (pageData && pageData.length > 0) {
                    ModalManager.openCustomizer(
                        <PreviewModal startIndex={0} currentPageData={pageData}/>
                    )
                }
            },
            position: 'center'
        },
        {
            selector: '.starterblocks-import-wizard-wrapper',
            caption: __('Import Wizard', starterblocks.i18n),
            content: __('When you click to import a template, sometimes you will be missing one of the required plugins. StarterBlocks will do its best to help you install what\'s missing. If some of them are premium plugins, you will be provided details on where you can get them.', starterblocks.i18n),
            direction: 'right',
            offset: {
                x: 0,
                y: 85,
                arrowX: 40,
                arrowY: 25
            },
            box: {
                width: 250,
                height: 169
            },
            action: () => {
                // if (ModalManager.isModalOpened() === false) ModalManager.open(<LibraryModal autoTourStart={false} />)
                if (document.getElementsByClassName('tooltipster-box')) 
                    document.getElementsByClassName('tooltipster-box')[0].style.display = 'none';
                ModalManager.show();
                ModalManager.closeCustomizer();
                const pageData = getPageData();
                if (pageData && pageData.length > 0) setImportingTemplate(pageData[0]);
                setTimeout(() => {
                    const openedPanel = document.getElementsByClassName('starterblocks-modal-wrapper');
                    if (openedPanel && openedPanel.length > 0) {
                        let openPanel = openedPanel[0].getBoundingClientRect();
                        let box = {top: openPanel.top + 90, left: openPanel.left - 320};
                        dispatch('starterblocks/sectionslist').setChallengeTooltipRect(box);
                    }
                    if (document.getElementsByClassName('tooltipster-box')) 
                        document.getElementsByClassName('tooltipster-box')[0].style.display = 'block';
                }, 0)
            }
        },
        {
            selector: '.components-base-control.editor-page-attributes__template',
            caption: __('Template Conflict', starterblocks.i18n),
            content: __('Sometimes your theme may conflict with a template. If you\'re on a page, you can set a page template and override your theme in different ways, including just passing it all together.', starterblocks.i18n),
            action: () => {
                setImportingTemplate(null);
                ModalManager.hide();
                dispatch('core/edit-post').openGeneralSidebar('edit-post/document');
                if (select('core/edit-post').isEditorPanelOpened('page-attributes') === false) dispatch('core/edit-post').toggleEditorPanelOpened('page-attributes');
                const openedPanel = document.getElementsByClassName('editor-page-attributes__template');
                if (openedPanel && openedPanel.length > 0) {
                    let openPanel = openedPanel[0].getBoundingClientRect();
                    let box = {top: openPanel.top, left: openPanel.left - 320};
                    dispatch('starterblocks/sectionslist').setChallengeTooltipRect(box);
                    dispatch('starterblocks/sectionslist').setChallengeListExpanded(false);
                }
            },
            offset: {
                x: 0,
                y: 5,
                arrowX: 40,
                arrowY: 0
            },
            box: {
                width: 250,
                height: 169
            },
            direction: 'right'
        }
    ]
};