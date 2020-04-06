const {__} = wp.i18n;
const {parse} = wp.blocks;
const {compose} = wp.compose;
const {withDispatch, withSelect, select} = wp.data;
const {Component, Fragment, useState, useContext} = wp.element;
const {Spinner} = wp.components;

import InstallPluginStep from './InstallPluginStep';
import ProPluginStep from './ProPluginsStep';
import {ModalManager} from '../modal-manager'

import './style.scss'

const PLUGIN_STEP = 0;
const PRO_STEP = 1;
const IMPORT_STEP = 2;

function ImportWizard(props) {

    const {missingPlugins, missingPros, startImportTemplate, closeWizard} = props;
    const [currentStep, setCurrentStep] = useState(PLUGIN_STEP);
    const [importing, setImporting] = useState(false);

    const toNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const onCloseWizard = () => {
        setCurrentStep(PLUGIN_STEP);
        ModalManager.closeWizard()
        closeWizard();
    };

    if (currentStep === PLUGIN_STEP && missingPlugins.length < 1)
        setCurrentStep(PRO_STEP);
    if (currentStep === PRO_STEP && missingPros.length < 1)
        setCurrentStep(IMPORT_STEP);
    if (currentStep === IMPORT_STEP && importing === false) {
        setImporting(true);
        startImportTemplate();
    }

    return (
        <div className="starterblocks-import-wizard-overlay">
            <div className="starterblocks-import-wizard-wrapper">
                <div className="starterblocks-import-wizard-header">
                    <h3>{__('Template Import Wizard')}</h3>
                    <button className="starterblocks-builder-close-modal" onClick={onCloseWizard}>
                        <i className={'fas fa-times'}/>
                    </button>
                </div>
                {(currentStep === PLUGIN_STEP) &&
                <InstallPluginStep missingPlugins={missingPlugins} toNextStep={toNextStep}
                                   onCloseWizard={onCloseWizard}/>}
                {(currentStep === PRO_STEP) && <ProPluginStep missingPros={missingPros} onCloseWizard={onCloseWizard}/>}
                {(currentStep === IMPORT_STEP) &&
                <div className="starterblocks-import-wizard-spinner-wrapper"><Spinner/></div>
                }
            </div>
        </div>
    );
}


export default compose([
    withDispatch((dispatch) => {
        return {};
    }),

    withSelect((select, props) => {
        return {};
    })
])(ImportWizard);
