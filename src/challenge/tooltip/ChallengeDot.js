import {compose} from '@wordpress/compose';
import {withDispatch, withSelect} from '@wordpress/data';
const {cloneElement, findDOMNode, useRef, useEffect} = wp.element;
function ChallengeDot(props) {
    const {setChallengeTooltipRect} = props;
    const selectedElement = useRef(null);
    useEffect(() => {
        onResize();
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, [])

    const onResize = () => {
        setChallengeTooltipRect(getElementBounding());
    };

    const getElementBounding = () => {
        const rect = findDOMNode(selectedElement.current).getBoundingClientRect();
        return {left: rect.left, top: rect.top, width: rect.width, height: rect.height};
    }

    return <span class="challenge-dot tooltipstered" ref={selectedElement}>
        &nbsp;
    </span>;
}


export default compose([
    withDispatch((dispatch) => {
        const {setChallengeTooltipRect} = dispatch('starterblocks/sectionslist');
        return {
            setChallengeTooltipRect
        };
    })
])(ChallengeDot);
