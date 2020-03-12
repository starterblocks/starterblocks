import React from 'react';

const {Component, Fragment} = wp.element;
const {compose} = wp.compose;
const {select, withDispatch, withSelect} = wp.data;
const {__} = wp.i18n;

import {CheckboxControl} from '@wordpress/components';

function DependencyFilter(props) {
	const {dependencyFilters} = props;
	const {setDependencyFilters} = props;

	const onChangeCategory = (data) => {
		if (isDisabledCategory(data)) return;
		setActiveCategory(data.slug);
	};
	// Give the selected category(activeCategory) label className as "active"
	const isChecked = (pluginKey) => {
		return dependencyFilters[pluginKey];
	};

	const toggleChecked = (pluginKey) => {
		setDependencyFilters({...dependencyFilters, [pluginKey]: !dependencyFilters[pluginKey]});
	};

	const setAllCheckedAs = (newVal) => {
		setDependencyFilters(
			Object.keys(dependencyFilters).reduce((acc, key) => {
				return {...acc, [key]: newVal}
			}, {})
		);
	};

	return (
		<Fragment>
			<h3>{__('Dependencies', 'starterblocks')}</h3>
			<div className="starterblocks-select-actions">
				<a href="#" onClick={() => setAllCheckedAs(true)}>Select All</a>
				<span>&nbsp; / &nbsp;</span>
				<a href="#" onClick={() => setAllCheckedAs(false)}>Select None</a>
			</div>
			<ul className="starterblocks-sidebar-dependencies">
				<li>
					<CheckboxControl
						label="None"
						checked={isChecked('none')}
						onChange={() => toggleChecked('none')}
					/>
				</li>
				{
					/* TODO - Inside the Library state is now a library.dependencies

					Inside that is pages & sections each with a key => count

						dependencies: {
							sections: {
								qubely: 150
							},
							pages: {
								qubely: 114
							}
						}

					Hide any supported_plugins not in the dependencies for the current page (sections/pages)
					Remember, Collections are just Pages.  ;)

					Also, this doesn't seem to be working properly on Collections. If you select none only it shows
					everything. If you select Qubely only, it shows nothing. Probably sending in the collection data and
					not expanding to the underlying page data.  ;)

					* */
					Object.keys(dependencyFilters).map(pluginKey => {
						if (pluginKey === 'none') return null;
						const pluginInstance = starterblocks.supported_plugins[pluginKey];
						return (
							<li className={!pluginInstance.version ? 'missing-dependency' : ''} key={pluginKey}>
								<CheckboxControl
									label={pluginInstance.name}
									checked={isChecked(pluginKey)}
									onChange={() => toggleChecked(pluginKey)}
								/>

								{pluginInstance.url ?
									<a href={pluginInstance.url} target="_blank">
									<i className="fa fa-external-link-alt"></i>
								</a> : null}
							</li>
						);

					})
				}
			</ul>

		</Fragment>
	);
}

export default compose([
	withDispatch((dispatch) => {
		const {setDependencyFilters} = dispatch('starterblocks/sectionslist');
		return {
			setDependencyFilters
		};
	}),

	withSelect((select, props) => {
		const {getDependencyFilters} = select('starterblocks/sectionslist');
		return {
			dependencyFilters: getDependencyFilters()
		};
	})
])(DependencyFilter);
