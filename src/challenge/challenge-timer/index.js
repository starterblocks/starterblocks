/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n'
import './style.scss'

const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;

function ChallengeTimer(props) {
    
    return (
        <div className='block-timer'>
            <div>
                <h3>{__('StarterBlocks Challenge', starterblocks.i18n)}</h3>
                <p><span>5:00</span>{__(' remaining', starterblocks.i18n)}</p>
            </div>
            <div class="caret-icon">
                <i class="fa fa-caret-down"></i>
            </div>
        </div>
    );

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
])(ChallengeTimer);
