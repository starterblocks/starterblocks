/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n'
import {Tooltip} from '@wordpress/components';
import './style.scss'

const {compose} = wp.compose;
const {withDispatch, withSelect, select, subscribe} = wp.data;
const {useDispatch} = wp.data;
/**
 * External dependencies
 */

import {ModalManager} from '../modal-manager'
import PreviewModal from '../modal-preview';
import {disableBodyScroll, enableBodyScroll} from 'body-scroll-lock';
import Tour from 'reactour';




function StarterBlocksTour(props) {
    const {setTourActiveButtonGroup, setTourPreviewVisible, setTourOpen, setImportingTemplate} = props;
    const {isTourOpen, getPageData} = props;

    const tourConfig = [
        {
            selector: '.starterblocks-pagelist-modal-inner',
            content: __('Welcome to the StarterBlocks! Let\'s go over how to use our library.', 'starterblocks'),
            position: 'center'
        },
        {
            selector: '[data-tut="tour__navigation"]',
            content: ({goTo}) => (
                <div>
                    These are the different types of templates we have.
                    <ul>
                        <li><strong>Sections</strong> are blocks, or parts of a page. A full page is made of of many
                            sections.
                        </li>
                        <li><strong>Pages</strong> are you guessed it, pages full of sections.
                        </li>
                        <li><strong>Collections</strong> are groups of pages that all follow the same style. Almost like
                            a page themes.
                        </li>
                        <li><strong>Saved</strong> are reusable blocks that you've saved and want to use.
                        </li>
                    </ul>
                </div>
            ),
            position: 'center'
        },
        {
            selector: '[data-tut="tour__filtering"]',
            content: 'This area is where you can search and filter to find the right kind of templates you want.',
            position: 'right'
        },
        {
            selector: '[data-tut="tour__filter_dependencies"]',

            content: () => (
                <div>
                    Some templates require certain plugins. You can filter or select those templates. Hint, if the text
                    is a <a href="#" className="missing-dependency">little orange</a>, you don't have that plugin
                    installed
                    yet, but don't
                    worry. StarterBlocks will help you with that too.
                </div>
            ),
            action: () =>
                console.log('Scroll down the [data-tut="tour__filtering"] directory smoothly'),
            position: 'right'
        },
        {
            selector: '[data-tut="tour__main_body"]',
            content: __('This area is where the templates will show up that match the filters you\'ve selected. You can click on many of them to preview or import them.', 'starterblocks'),
            position: 'center'
        },
        {
            selector: '[data-tut="main_body"]',
            content: __('When you hover over a template you can see via icons what plugins are required for this template. You can also click to import and sometimes preview a design.', 'starterblocks'),
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
            selector: '[data-tut="tour__preview_sidebar"]',
            content: __('This is the preview dialog. It gives more details about the template and helps you to see what you could expect the templates to look like.', 'starterblocks'),
            action: () => {
                setTourActiveButtonGroup(false);
                const pageData = getPageData();
                if (pageData && pageData.length > 0) {
                    for (let index = 0; index < pageData.length; index++) {
                        if ('url' in pageData[index] && pageData[index]['url']) {
                            ModalManager.openCustomizer(
                                <PreviewModal startIndex={index} currentPageData={pageData}/>
                            )
                            break
                        }
                    }

                }
            },
            position: 'right'
        },
        {
            selector: '[data-tut="tour__import_wizard"]',
            content: `Here's an example of the required plugins installer. If you're missing a plugin StarterBlocks can
            automatically install and activate it for you as long as it's free. If a premium third party plugin is required,
            you will see a button for an external link instead. You must have all the required plugins installed and
            activated before a template can be imported.`,
            position: 'bottom',
            action: () => {
                const pageData = getPageData();
                if (pageData && pageData.length > 0) setImportingTemplate(pageData[0])
                ModalManager.closeCustomizer();
            }
        },
        {
            selector: '[data-tut="tour__main_body"]',
            content: () => (
                <div>
                    <h3>Congrats!</h3>
                    <p>Well, that's the tour. Take a look around. We hope you love StarterBlocks!</p>
                </div>
            ),
            action: () => {
                // TODO Remove me when the above step is working
                ModalManager.closeCustomizer();
                setImportingTemplate(null);
            },

            position: 'center'
        },
    ];


    const accentColor = '#5cb7b7';
    const disableBody = target => disableBodyScroll(target);
    const enableBody = target => enableBodyScroll(target);

    const onRequestClose = () => {
        ModalManager.closeCustomizer();
        setTourOpen(false);
        setTourActiveButtonGroup(false);
        // TODO - Add close import dialog close (onImportTemplate)
    }

    return <Tour
        onRequestClose={onRequestClose}
        steps={tourConfig}
        isOpen={isTourOpen}
        maskClassName="mask"
        className="helper"
        lastStepNextButton={<button>Finish</button>}
        rounded={0}
        accentColor={accentColor}
        disableInteraction={false}
    />
}


export default compose([
    withDispatch((dispatch) => {
        const {setTourActiveButtonGroup, setTourPreviewVisible, setTourOpen, setImportingTemplate} = dispatch('starterblocks/sectionslist');
        return {
            setTourActiveButtonGroup,
            setTourPreviewVisible,
            setTourOpen,
            setImportingTemplate
        };
    }),

    withSelect((select, props) => {
        const {getTourOpen, getPageData} = select('starterblocks/sectionslist');
        return {
            isTourOpen: getTourOpen(),
            getPageData
        };
    })
])(StarterBlocksTour);
