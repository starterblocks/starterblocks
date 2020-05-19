const { compose } = wp.compose;
const { withDispatch, withSelect } = wp.data;
const { useState, useEffect } = wp.element;
import {ModalManager} from '~starterblocks/modal-manager';
import CONFIG from '../config';
const PADDING_X = 20;
const PADDING_Y = 0;
const ARROW_HEIGHT = 20;
const DEFAULT_BOX_WIDTH = 200;
const DEFAULT_OFFSET_X = 0;
const DEFAULT_OFFSET_Y = 20;
function TooltipBox(props) {
    const { challengeStep, tooltipRect, isOpen, setChallengeStep, setChallengeFinalStatus } = props;
    const [style, setStyle] = useState({});
    const [arrowStyle, setArrowStyle] = useState({});
    const [content, setContent] = useState('');
    const [wrapperClassname, setWrapperClassname] = useState('');

    const isVisible = () => {
        return ((challengeStep >= 0 || challengeStep > CONFIG.totalStep) && isOpen);
    }

    const calculateLeftWithStepInformation = () => {
        const stepInformation = CONFIG.list[challengeStep];
        const boxWidth = stepInformation.box ? stepInformation.box.width : DEFAULT_BOX_WIDTH;
        const offsetX = stepInformation.offset ? stepInformation.offset.x :DEFAULT_OFFSET_X;
        const offsetY = stepInformation.offset ? stepInformation.offset.y :DEFAULT_OFFSET_Y;
        switch(stepInformation.direction) {
            case 'left':
                return (tooltipRect.left + offsetX - boxWidth);
            case 'right':
                return (tooltipRect.left + offsetX + boxWidth);
            case 'top':
            case 'bottom':
                return (tooltipRect.left + offsetX - boxWidth / 2);
            default:
                return (tooltipRect.left + offsetX);
        } 
    }
    // adjust position and content upon steps change
    useEffect(() => {
        if (isVisible() && tooltipRect) {
            const stepInformation = CONFIG.list[challengeStep];
            if (stepInformation) {
                const offsetX = stepInformation.offset ? stepInformation.offset.x :DEFAULT_OFFSET_X;
                const offsetY = stepInformation.offset ? stepInformation.offset.y :DEFAULT_OFFSET_Y;
                setStyle({
                    ...style,
                    display: 'block',
                    width: stepInformation.box ? stepInformation.box.width : DEFAULT_BOX_WIDTH,
                    left: calculateLeftWithStepInformation(),
                    top: tooltipRect.top + offsetY + PADDING_Y + ARROW_HEIGHT
                });
                setContent(stepInformation.content);
                setArrowStyle({
                    ...arrowStyle,
                    display: 'block',
                    left: tooltipRect.left + offsetX,
                    top: tooltipRect.top + offsetY + PADDING_Y
                });
            }
        } else {
            setStyle({ ...style, display: 'none' });
            setArrowStyle({...arrowStyle, display: 'none'});
        }
    }, [JSON.stringify(tooltipRect), challengeStep, isOpen]);

    // update wrapper class name based on step change
    useEffect(() => {
        const stepInformation = CONFIG.list[challengeStep];
        if (stepInformation) {
            switch(stepInformation.direction) {
                case 'top':
                    setWrapperClassname('challenge-tooltip tooltipster-sidetip tooltipster-top');
                    break;
                case 'bottom':
                    setWrapperClassname('challenge-tooltip tooltipster-sidetip tooltipster-bottom');
                    break;
                default:
                    setWrapperClassname('challenge-tooltip tooltipster-sidetip');
            }
            
        }
    }, [challengeStep])

    const toNextStep = () => {
        if (challengeStep === CONFIG.totalStep - 1) {
            // finalize challenge
            ModalManager.show();
            setChallengeFinalStatus('success');
        }
        setChallengeStep(challengeStep + 1);
    }

    
    return (
        <div className={wrapperClassname}>
            <div className="tooltipster-box" style={style}>
                {content}
                <div className="btn-row">
                    <button className="challenge-done-btn" onClick={toNextStep}>Done</button>
                </div>
            </div>
            <div class="tooltipster-arrow" style={arrowStyle}>
                <div class="tooltipster-arrow-uncropped">
                    <div class="tooltipster-arrow-border"></div>
                    <div class="tooltipster-arrow-background"></div>
                </div>
            </div>
        </div>
    );
}


export default compose([
    withDispatch((dispatch) => {
        const { setChallengeStep, setChallengeFinalStatus } = dispatch('starterblocks/sectionslist');
        return {
            setChallengeStep,
            setChallengeFinalStatus
        };
    }),

    withSelect((select, props) => {
        const { getChallengeTooltipRect, getChallengeOpen, getChallengeStep, getChallengeFinalStatus } = select('starterblocks/sectionslist');
        return {
            tooltipRect: getChallengeTooltipRect(),
            isOpen: getChallengeOpen(),
            challengeStep: getChallengeStep(),
            finalStatus: getChallengeFinalStatus()
        };
    })
])(TooltipBox);
