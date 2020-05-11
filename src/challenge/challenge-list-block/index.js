/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n'
import CONFIG from '../config';
import './style.scss'

const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;
const {useState, useEffect} = wp.element;

const START_STEP = 0;

function ChallengeListBlock(props) {
    const {step} = props;
    const [buttonRowClassname, setButtonRowClassname] = useState('challenge-button-row');
    return (
        <div className='challenge-list-block'>
            <p>{__('Complete the challenge and get up and running within 5 minutes', starterblocks.i18n)}</p>
            <div className='challenge-bar'>
                <div></div>
            </div>
            <ul className='challenge-list'>
                {
                    CONFIG.map((item, i) => {
                        return (<li>{item.caption}</li>);
                    })
                }
            </ul>
            <div className='challenge-button-row'>
                {step === START_STEP && <button className='btn-challenge-start'>{__('Start Challenge', starterblocks.i18n)}</button>}
                {step === START_STEP && <button className='btn-challenge-skip'>{__('Skip Challenge', starterblocks.i18n)}</button>}
                {step !== START_STEP && <button className='btn-challenge-cancel'>{__('Cancel Challenge', starterblocks.i18n)}</button>}
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
])(ChallengeListBlock);
