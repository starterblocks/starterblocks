/**
 * WordPress dependencies
 */
import {__} from '@wordpress/i18n'
import './style.scss'
import helper from './helper';
import ChallengeListBlock from './challenge-list-block';
import ChallengeTimer from './challenge-timer';

const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;
const {useState, useEffect} = wp.element;

const START_STEP = -1;

function StarterBlocksChallenge(props) {
    const {autoTourStart} = props;
    const {challengeStep, setChallengeStep} = props;
    const [challengeClassname, setChallengeClassname] = useState('starterblocks-challenge');
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (challengeStep === START_STEP) setChallengeClassname('starterblocks-challenge challenge-start')
    }, []);

    const onStarted = () => {
        setChallengeStep(0);
        setStarted(true);
    }

    return (
        <div className={challengeClassname}>
            <ChallengeListBlock {...{started, onStarted}} />
            <ChallengeTimer started={started} />
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
        const {getChallengeStep} = select('starterblocks/sectionslist');
        return {
            challengeStep: getChallengeStep()
        };
    })
])(StarterBlocksChallenge);
