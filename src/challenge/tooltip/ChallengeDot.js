import {compose} from '@wordpress/compose';
import {withDispatch, withSelect} from '@wordpress/data';
import CONFIG from '../config';
const {findDOMNode, useRef, useEffect} = wp.element;
function ChallengeDot(props) {
    const {step, challengeStep, isOpen, setChallengeTooltipRect} = props;
    const selectedElement = useRef(null);
    useEffect(() => {
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, [])

    useEffect(() => {
        onResize();
    }, [challengeStep, isOpen]);

    const isVisible = () => {
        return ((challengeStep >= 0 && challengeStep < CONFIG.totalStep) && isOpen);
    }

    const onResize = () => {
        const box = getElementBounding();
        if (box) setChallengeTooltipRect(box);
    };

    const getElementBounding = () => {
        if (selectedElement && selectedElement.current) {
            const rect = findDOMNode(selectedElement.current).getBoundingClientRect();
            return {left: rect.left, top: rect.top, width: rect.width, height: rect.height};
        }
        return null;
    }
    if (isVisible() && challengeStep === step)
        return <span class="challenge-dot tooltipstered" ref={selectedElement}>
            &nbsp;
        </span>;
    return null;
}


export default compose([
    withDispatch((dispatch) => {
        const {setChallengeTooltipRect} = dispatch('starterblocks/sectionslist');
        return {
            setChallengeTooltipRect
        };
    }),
    withSelect((select, props) => {
        const { getChallengeOpen, getChallengeStep } = select('starterblocks/sectionslist');
        return {
            isOpen: getChallengeOpen(),
            challengeStep: getChallengeStep()
        };
    })
])(ChallengeDot);
