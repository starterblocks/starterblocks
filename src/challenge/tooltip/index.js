import ToolTipController from './Controller';
import ChallengeDot from './ChallengeDot';
import TooltipHolder from './TooltipHolder';

const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;
const {useState, useEffect} = wp.element;


function ChallengeTooltip(props) {

    const {step} = props;
    
    return (
        <ToolTipController step={step}>
            <ChallengeDot />
            <TooltipHolder step={step} />
        </ToolTipController>
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

    withSelect((select) => {
        const {getChallengeStep, getChallengeOpen} = select('starterblocks/sectionslist');
        return {
            challengeStep: getChallengeStep(),
            isOpen: getChallengeOpen()
        };
    })
])(ChallengeTooltip);
