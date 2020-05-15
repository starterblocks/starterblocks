/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n'
import ChallengeStepItem from './ChallengeStepItem';
import ProgressBar from './ProgressBar';
import CONFIG from '../config';
import './style.scss'

const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;
const {useState, useEffect} = wp.element;

const START_STEP = -1;

function ChallengeListBlock(props) {
    const {challengeStep, started, onStarted} = props;
    const [buttonRowClassname, setButtonRowClassname] = useState('challenge-button-row');
    useEffect(() => {
        setButtonRowClassname(started ? 'challenge-button-row started' : 'challenge-button-row');
    }, [started])
    
    return (
        <div className='challenge-list-block'>
            <p>{__('Complete the challenge and get up and running within 5 minutes', starterblocks.i18n)}</p>
            <ProgressBar currentStep={challengeStep} />
            <ul className='challenge-list'>
                {
                    CONFIG.list.map((item, i) => {
                        return (<ChallengeStepItem step={i} currentStep={challengeStep} caption={item.caption} />);
                    })
                }
            </ul>
            <div className={buttonRowClassname}>
                {challengeStep === START_STEP && 
                    <button className='btn-challenge-start' onClick={onStarted}>{__('Start Challenge', starterblocks.i18n)}</button>}
                {challengeStep === START_STEP && <button className='btn-challenge-skip'>{__('Skip Challenge', starterblocks.i18n)}</button>}
                {challengeStep !== START_STEP && <button className='btn-challenge-cancel'>{__('Cancel Challenge', starterblocks.i18n)}</button>}
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
        const {getChallengeStep} = select('starterblocks/sectionslist');
        return {
            challengeStep: getChallengeStep()
        };
    })
])(ChallengeListBlock);
