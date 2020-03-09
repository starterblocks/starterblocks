import React, {cloneElement} from 'react';

const {__} = wp.i18n
const {Component, Fragment, useContext, useEffect, useState} = wp.element;
import SingleItemContext from '../../contexts/SingleItemContext';
import TemplateModalContext from '../../contexts/TemplateModalContext';
import {missingPro, missingRequirement} from '../../stores/helper';
import * as Icons from '~starterblocks/icons'
import './style.scss'

const ButtonGroup = (props) => {
	const {data, activeItemType, index, pageData} = useContext(SingleItemContext);
	const {openSitePreviewModal, onImportTemplate, spinner} = useContext(TemplateModalContext);
	const [rootClassName, setRootClassName] = useState('starterblocks-import-button-group');

	const {ID, image, url, pro, requirements, blocks} = data;

	useEffect(() => {
		if (spinner === null && rootClassName !== 'starterblocks-import-button-group')
			setRootClassName('starterblocks-import-button-group')
		if (spinner !== null && rootClassName === 'starterblocks-import-button-group')
			setRootClassName('starterblocks-import-button-group disabled');

	}, [spinner])

	const triggerImportTemplate = (data) => {
		if (spinner === null) onImportTemplate(data);
	}

	// const todoItems = blocks.map((todo, index) =>
	// 	return ('Icons.' + index)
	// )

	const isMissingRequirement = missingRequirement(pro, requirements);
	const isMissingPro = missingPro(pro);

	return (
		<div className={rootClassName}>
			<div className="action-buttons">

				{url &&
				<a className="starterblocks-button" target="_blank"
				   onClick={() => openSitePreviewModal(index, pageData)}>
					<i className="fa fa-share"/> {__('Preview')}
				</a>
				}
				<a className="starterblocks-button starterblocks-button-download"
				   onClick={() => triggerImportTemplate(data)}>
					{spinner === ID ? <i className="fas fa-spinner fa-pulse"/> :
						<i className="fas fa-download"/>}{__('Import')}
				</a>

			</div>
			<div className="starterblocks-button-display-dependencies">
				{/*
						TODO - Import all icons used in this block if had
						starterblocks.blocks

						Please also use starterblocks.blocks.name as a hover to show what block plugin is used.
						Add a tooltip.

					*/}
				<span title="CoBlocks" className="missing-dependency">
					<Icons.coblocks/>
				</span>
				<span title="Stackable">
					<Icons.ugb/>
				</span>
			</div>

		</div>
	)
}

export default ButtonGroup
