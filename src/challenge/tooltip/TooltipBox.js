const { compose } = wp.compose;
const { withDispatch, withSelect } = wp.data;
const { useState, useEffect } = wp.element;
import CONFIG from '../config';
const PADDING_X = 20;
const PADDING_Y = 20;
function TooltipBox(props) {
    const { challengeStep, tooltipRect, isOpen } = props;
    const [style, setStyle] = useState({});

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
    useEffect(() => {
        if (isVisible()) {
            const stepInformation = CONFIG.list[challengeStep];
            setStyle({
                ...style,
                display: 'block',
                width: stepInformation.box.width,
                left: calculateLeftWithStepInformation(),
                top: tooltipRect.top + stepInformation.offset.y
            });
        } else
            setStyle({ ...style, display: 'none' });
    }, [JSON.stringify(tooltipRect), challengeStep, isOpen]);

    return (
        <div className="tooltip-box" style={style}>
            Tooltip
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
