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

import {disableBodyScroll, enableBodyScroll} from 'body-scroll-lock';
import Tour from 'reactour';
import StyledTooltip from './tooltip'


function StarterBlocksTour(props) {
    const {setTourButtonGroupVisible, setTourPreviewVisible, isTourOpen, setTourOpen} = props;
    const tourConfig = [
        {
            selector: '[data-tut="tour__library_button"]',
            content: __('Let\'s get started! Click here to open the library.', 'starterblocks'),
            // TODO - If the dialog is already open, skip this step.
            position: 'bottom'
        },
        {
            selector: '[data-tut="tour__main_body"]',
            content: __('This area is where the templates will show up that match the filters you\'ve selected. You can click on many of them to preview or import them.', 'starterblocks'),
            position: 'center'
        },
        {
            selector: '[data-tut="tour__filtering"]',
            content: 'This area is where you can search and filter to find the right kind of templates you want.',
            position: 'right'
        },
        {
            selector: '[data-tut="tour__filter_dependencies"]',
            content: `Some templates require certain plugins. You can filter or select those templates. Hint, if the text
             is a <span style="color: #867e76">little orange</span>, you don't have that plugin installed yet, but don't
             worry. StarterBlocks will help you with that too.`,
            position: 'left'
        },
        {
            // TODO - Show / scroll to and hover of first template with a preview button
            selector: '[data-tut="main_body"]',
            content: __('When you hover over a template you can see via icons what plugins are required for this template. You can also click to import and sometimes preview a design.', 'starterblocks'),
            action: () => {
                setTourButtonGroupVisible(true);
            },
            position: 'bottom'
        },
        {
            // TODO - Open the preview dialog for that template.
            selector: '[data-tut="tour__preview_sidebar"]',
            content: __('This is the preview dialog. It gives more details about the template and helps you to see what you could expect the templates to look like.', 'starterblocks'),
            action: () =>
                console.log('Run the command to open the preview dialog'),
            position: 'right'
        },
        {
            // TODO - Close Dialog
            selector: '[data-tut="tour__navigation"]',
            content: ({goTo}) => (
                <div>
                    These are the different types of templates we have.
                    <br/><StyledTooltip data-tooltip="AKA blocks, or rows">Sections</StyledTooltip> are blocks, or parts of a page. A
                    full page is made of of many sections.
                    <br/><StyledTooltip data-tooltip="A complete page template">Pages</StyledTooltip> are you guessed it, pages full of
                    sections.
                    <br/><StyledTooltip data-tooltip="A set, style, or theme of pages">Collections</StyledTooltip> are groups of pages
                    that all follow the same style. Almost like a page
                    themes.
                    <br/><StyledTooltip data-tooltip="Copy and paste your customized blocks.">Saved</StyledTooltip> are reusable blocks
                    that you've saved and want to use.
                </div>
            ),
            position: 'bottom'
        },

        {
            // TODO - Open an import wizard
            selector: '[data-tut="tour__import_wizard"]',
            content: `Here's an example of the required plugins installer. If you're missing a plugin StarterBlocks can
            automatically install and activate it for you as long as it's free. If a premium third party plugin is required,
            you will see a button for an external link instead. You must have all the required plugins installed and
            activated before a template can be imported.`,
            position: 'bottom'
        },


        {
            selector: '[data-tut="tour__main_body"]',
            content: () => (
                <div>
                    <h3>Congrats!</h3>
                    <p>Well, that's the tour. Take a look around. We hope you love StarterBlocks!</p>
                </div>
            ),
            // style: {
            //     backgroundColor: "black",
            //     color: "white"
            // }
            action: () =>
                console.log('Close import wizard'),
            position: 'center'
        },
    ];


    const accentColor = '#5cb7b7';
    const disableBody = target => disableBodyScroll(target);
    const enableBody = target => enableBodyScroll(target);

    return <Tour
        onRequestClose={() => setTourOpen(false)}
        steps={tourConfig}
        isOpen={isTourOpen}
        maskClassName="mask"
        className="helper"
        rounded={5}
        accentColor={accentColor}
    />
}


export default compose([
    withDispatch((dispatch) => {
        const {setTourButtonGroupVisible, setTourPreviewVisible, setTourOpen} = dispatch('starterblocks/sectionslist');
        return {
            setTourButtonGroupVisible,
            setTourPreviewVisible,
            setTourOpen
        };
    }),

    withSelect((select, props) => {
        const {getTourOpen} = select('starterblocks/sectionslist');
        return {
            isTourOpen: getTourOpen()
        };
    })
])(StarterBlocksTour);
