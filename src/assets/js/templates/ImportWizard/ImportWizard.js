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
import ImportStep from './ImportStep';

const PLUGIN_STEP = 0;
const PRO_STEP = 1;
const IMPORT_STEP = 2;
function BlockImportWizard(props) {
    const {missingPlugins, missingPros, startImportTemplate, closeWizard} = props;
    const [spinner, setSpinner] = useState(0);
    const [currentStep, setCurrentStep] = useState(PLUGIN_STEP);

    const toNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const onCloseWizard = () => {
        setCurrentStep(PLUGIN_STEP);
        closeWizard();
    };

    if (currentStep === PLUGIN_STEP && missingPlugins.length < 1)
        setCurrentStep(PRO_STEP);
    if (currentStep === PRO_STEP && missingPros.length < 1)
        setCurrentStep(IMPORT_STEP);

    return (
        <div className="starterblocks-wizard-overlay">
            <div className="starterblocks-wizard-wrapper">
                <div class="starterblocks-wizard-header">
                    <h3>{__('Your Selected Template is Being Imported')}</h3>
                    <button className="starterblocks-builder-close-modal" onClick={onCloseWizard} >
                        <i className={"fas fa-times"} />
                    </button>
                </div>
                {(currentStep === PLUGIN_STEP) && <InstallPluginStep missingPlugins={missingPlugins} toNextStep={toNextStep} onCloseWizard={onCloseWizard} /> }
                {(currentStep === PRO_STEP) && <ProPluginStep missingPros={missingPros}  onCloseWizard={onCloseWizard} /> }
                {(currentStep === IMPORT_STEP) && <ImportStep startImportTemplate={startImportTemplate} onCloseWizard={onCloseWizard}  /> }
            </div>
        </div>
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