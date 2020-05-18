/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n'
import './style.scss'
import helper from './helper';
import CONFIG from './config';
import ChallengeListBlock from './challenge-list-block';
import ChallengeTimer from './challenge-timer';

const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;
const {useState, useEffect} = wp.element;

function StarterBlocksChallenge(props) {
    const {autoChallengeStart} = props;
    const {isOpen, challengeStep, setChallengeStep} = props;
    const [challengeClassname, setChallengeClassname] = useState('starterblocks-challenge');
    const [started, setStarted] = useState(false);
    const [closed, setClosed] = useState(false);

    useEffect(() => {
        if (challengeStep !== CONFIG.beginningStep && isOpen) {
            setChallengeClassname('starterblocks-challenge started')
            setStarted(true);
        }
    }, [challengeStep, isOpen]);

    const onStarted = () => {
        setChallengeStep(0);
        setStarted(true);
    }

    return (
        <div className={challengeClassname}>
            { (closed === false) && <ChallengeListBlock {...{started, closed, onStarted}} /> }
            <ChallengeTimer {...{started, closed, setClosed}} />
        </div>
    );

}


export default compose([
    withDispatch((dispatch) => {
        const {setChallengeStep} = dispatch('starterblocks/sectionslist');
        return {
            setChallengeStep
        };
    }),

    withSelect((select, props) => {
        const {getChallengeStep, getChallengeOpen} = select('starterblocks/sectionslist');
        return {
            challengeStep: getChallengeStep(),
            isOpen: getChallengeOpen()
        };
    })
])(StarterBlocksChallenge);
