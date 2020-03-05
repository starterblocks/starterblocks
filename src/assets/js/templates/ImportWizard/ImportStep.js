const {apiFetch} = wp;
const {Component, Fragment} = wp.element;
const {__} = wp.i18n;

export default function ImportStep(props) {

    const {startImportTemplate, onCloseWizard} = props;

    return (
        <Fragment>
            <div class="starterblocks-wizard-body">
                <h5>{__('All Ready')}</h5>
                <p>{__('We are all ready to import.')}</p>
            </div>
            <div class="starterblocks-wizard-footer">
                <a class="button button-primary" onClick={startImportTemplate}>
                    {__('Import')}
                </a>
                <a class="button button-secondary" onClick={onCloseWizard}>
                    {__('Cancel')}
                </a>
            </div>
        </Fragment>
    );
}