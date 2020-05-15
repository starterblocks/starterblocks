const { compose } = wp.compose;
const { withDispatch, withSelect } = wp.data;
const { useState, useEffect } = wp.element;
import CONFIG from '../config';
const PADDING_X = 20;
const PADDING_Y = 0;
const ARROW_HEIGHT = 20;
function TooltipBox(props) {
    const { challengeStep, tooltipRect, isOpen } = props;
    const [style, setStyle] = useState({});
    const [arrowStyle, setArrowStyle] = useState({});
    const [content, setContent] = useState('');
    const [wrapperClassname, setWrapperClassname] = useState('');

    const isVisible = () => {
        return ((challengeStep >= 0 || challengeStep > CONFIG.totalStep) && isOpen);
    }

    const calculateLeftWithStepInformation = () => {
        const stepInformation = CONFIG.list[challengeStep];
        const boxWidth = stepInformation.box.width;
        switch(stepInformation.direction) {
            case 'left':
                return (tooltipRect.left + stepInformation.offset.x - boxWidth);
            case 'right':
                return (tooltipRect.left + stepInformation.offset.x + boxWidth);
            case 'top':
            case 'bottom':
                return (tooltipRect.left + stepInformation.offset.x - boxWidth / 2);
            default:
                return (tooltipRect.left + stepInformation.offset.x);
        } 
    }
    // adjust position and content upon steps change
    useEffect(() => {
        if (isVisible() && tooltipRect) {
            const stepInformation = CONFIG.list[challengeStep];
            if (stepInformation) {
                setStyle({
                    ...style,
                    display: 'block',
                    width: stepInformation.box.width,
                    left: calculateLeftWithStepInformation(),
                    top: tooltipRect.top + stepInformation.offset.y + PADDING_Y + ARROW_HEIGHT
                });
                setContent(stepInformation.content);
                setArrowStyle({
                    left: tooltipRect.left + stepInformation.offset.x,
                    top: tooltipRect.top + stepInformation.offset.y + PADDING_Y
                });
            }
        } else
            setStyle({ ...style, display: 'none' });
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

    return (
        <div className={wrapperClassname}>
            <div className="tooltipster-box" style={style}>
                {content}
                <div className="btn-row">
                    <button className="challenge-done-btn">Done</button>
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
        const { setTourActiveButtonGroup, setTourPreviewVisible, setTourOpen, setImportingTemplate } = dispatch('starterblocks/sectionslist');
        return {
            setTourActiveButtonGroup,
            setTourPreviewVisible,
            setTourOpen,
            setImportingTemplate
        };
    }),

    withSelect((select, props) => {
        const { getChallengeTooltipRect, getChallengeOpen, getChallengeStep } = select('starterblocks/sectionslist');
        return {
            tooltipRect: getChallengeTooltipRect(),
            isOpen: getChallengeOpen(),
            challengeStep: getChallengeStep()
        };
    })
])(TooltipBox);
