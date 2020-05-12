import {__} from '@wordpress/i18n'
export default {
    initialSecondsLeft: 300,
    lastStep: 9,
    list: [
        {
            selector: '[data-tut="tour__navigation"]',
            caption: __('Template Type Tabs', starterblocks.i18n),
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
            ),
            position: 'center'
        },
        {
            selector: '[data-tut="tour__filtering"]',
            caption: __('Sidebar', starterblocks.i18n),
            content: __('This area is where you can search and filter to find the right kind of templates you want.', starterblocks.i18n),
            position: 'right',
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
                    duration: 300,
                });
            },

            position: 'right'
        },
        {
            selector: '[data-tut="tour__main_body"]',
            caption: __('Templates List', starterblocks.i18n),
            content: __('This area is where the templates will show up that match the filters you\'ve selected. You can click on many of them to preview or import them.', starterblocks.i18n),
            position: 'center',
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
            position: 'bottom'
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
            position: 'top',
            action: () => {
                // if (ModalManager.isModalOpened() === false) ModalManager.open(<LibraryModal autoTourStart={false} />)
                ModalManager.show();
                ModalManager.closeCustomizer();
                const pageData = getPageData();
                if (pageData && pageData.length > 0) setImportingTemplate(pageData[0])
                setNeedUpdate(new Date().toString());
            }
        },
        {
            selector: '.components-base-control.editor-page-attributes__template',
            caption: __('Template Conflict', starterblocks.i18n),
            content: __('Sometimes your theme may conflict with a template. If you\'re on a page, you can set a page template and override your theme in different ways, including just passing it all together.', starterblocks.i18n),
            action: () => {
                setImportingTemplate(null);
                ModalManager.hide();
            },
            position: 'center'
        }
    ]
};