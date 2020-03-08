const {__} = wp.i18n
const {compose} = wp.compose;
const {withDispatch, withSelect, select} = wp.data;
const {Notice} = wp.components;

function ErrorNotice(props) {
    const {discardAllErrorMessages, errorMessages} = props;
    return(
        <Notice status="error" onRemove={discardAllErrorMessages}>
            <p>An error occurred:
                {
                    errorMessages.join(', ')
                }
            </p>
        </Notice>
    );

}



export default compose([
    withDispatch((dispatch) => {
        const {
            discardAllErrorMessages
        } = dispatch('starterblocks/sectionslist');

        return {
            discardAllErrorMessages
        };
    })
])(ErrorNotice);
