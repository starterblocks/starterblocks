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

function ChallengeListBlock(props) {
    const {started, onStarted} = props;
    const {challengeStep, setChallengeOpen, setChallengeStep} = props;
    const [buttonRowClassname, setButtonRowClassname] = useState('challenge-button-row');
    useEffect(() => {
        setButtonRowClassname(started ? 'challenge-button-row started' : 'challenge-button-row');
    }, [started])
    
    const onCancelChallenge = () => {
        setChallengeOpen(false);
        setChallengeStep(-1);
    }

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
                {challengeStep === CONFIG.beginningStep && 
                    <button className='btn-challenge-start' onClick={onStarted}>{__('Start Challenge', starterblocks.i18n)}</button>}
                {challengeStep === CONFIG.beginningStep && <button className='btn-challenge-skip' onClick={onCancelChallenge}>{__('Skip Challenge', starterblocks.i18n)}</button>}
                {challengeStep !== CONFIG.beginningStep && <button className='btn-challenge-cancel' onClick={onCancelChallenge}>{__('Cancel Challenge', starterblocks.i18n)}</button>}
            </div>
        </div>
    );

}


export default compose([
    withDispatch((dispatch) => {
        const {setChallengeOpen, setChallengeStep} = dispatch('starterblocks/sectionslist');
        return {
            setChallengeOpen,
            setChallengeStep
        };
    }),

    withSelect((select) => {
        const {getChallengeStep} = select('starterblocks/sectionslist');
        return {
            challengeStep: getChallengeStep()
        };
    })
])(ChallengeListBlock);
