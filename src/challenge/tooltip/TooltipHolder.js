const {compose} = wp.compose;
const {withDispatch, withSelect} = wp.data;
const {useState, useEffect} = wp.element;

function TooltipHolder (props) {
    const {tooltipRect} = props;
    const [style, setStyle] = useState({});

    useEffect(() => {
        setStyle({...style, ...tooltipRect});
    }, [JSON.stringify(tooltipRect)]);

    return (
        <div className="toolTip" style={style}>
            Tooltip
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
        const {getChallengeTooltipRect} = select('starterblocks/sectionslist');
        return {
            tooltipRect: getChallengeTooltipRect()
        };
    })
])(TooltipHolder);
