const {apiFetch} = wp;
const {__} = wp.i18n;
const {parse} = wp.blocks;
const {compose} = wp.compose;
const {withDispatch, withSelect, select} = wp.data;
const {Component, Fragment, useState} = wp.element;
const {Spinner} = wp.components;

import {Modal, ModalManager} from '../ModalManager';
import InstallPluginStep from './InstallPluginStep';
import ProPluginStep from './ProPluginsStep';

const PLUGIN_STEP = 0;
const PRO_STEP = 1;
const IMPORT_STEP = 2;
function BlockImportWizard(props) {
    const {data, missingPlugins, missingPros, startImportTemplate} = props;
    const [spinner, setSpinner] = useState(0);
    const [currentStep, setCurrentStep] = useState(PLUGIN_STEP);

    const toNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    if (currentStep === PLUGIN_STEP && missingPlugins.length < 1)
        setCurrentStep(PRO_STEP);
    if (currentStep === PRO_STEP && missingPros.length < 1)
        setCurrentStep(IMPORT_STEP);

    return (
        <Modal className="starterblocks-wizard-modal">
            <div class="starterblocks-wizard-header">
                <h3>{__('Your Selected Template is Being Imported')}</h3>
                <button className="starterblocks-builder-close-modal" onClick={e => ModalManager.closeWizard() } >
                    <i className={"fas fa-times"} />
                </button>
            </div>
            {(currentStep === PLUGIN_STEP) && <InstallPluginStep missingPlugins={missingPlugins} toNextStep={toNextStep} /> }
            {(currentStep === PRO_STEP) && <ProPluginStep missingPros={missingPros} /> }
            {(currentStep === IMPORT_STEP) && <ImportStep startImportTemplate={startImportTemplate} /> }
            
        </Modal>
    );
}


export default compose([
    withDispatch((dispatch) => {
        return {
        };
    }),

    withSelect((select, props) => {
        return {
        };
    })
])(BlockImportWizard);