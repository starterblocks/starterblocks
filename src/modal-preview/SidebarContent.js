const {Component, useState} = wp.element
const {__} = wp.i18n


import findIndex from 'lodash/findIndex';
import sortBy from 'lodash/sortBy';

function SidebarContent(props) {
	const {itemData} = props;
	const {name, image, pro, blocks} = itemData;
	const [installList, setInstallList] = useState([]);
	const [versionList, setVersionList] = useState([]);
	const [proList, setProList] = useState([]);

	const isProReason = () => {
		return (!starterblocks.mokama && pro === true);
	}

	// const update
	const updateInstallList = (newRequirement) => {
		if (findIndex(installList, {plugin: newRequirement.plugin}) !== -1) { // To avoid duplicate effort
			installList.push(newRequirement);
			setInstallList(installList);
		}
	}

	// Version check: To be removed.
	const updateVersionList = (newRequirement) => {
		let index = findIndex(versionList, {plugin: newRequirement.plugin});
		if (index === -1) { // To avoid duplicate effort
			versionList.push(newRequirement);
			setVersionList(versionList);
		} else {
			if (compareVersion(newRequirement.version, versionList[index].version) === 1) {
				versionList.push(newRequirement);
				setVersionList(versionList);
			}
		}
	}

	const compareVersion = (v1, v2) => {
		if (typeof v1 !== 'string') return false;
		if (typeof v2 !== 'string') return false;
		v1 = v1.split('.');
		v2 = v2.split('.');
		const k = Math.min(v1.length, v2.length);
		for (let i = 0; i < k; ++i) {
			v1[i] = parseInt(v1[i], 10);
			v2[i] = parseInt(v2[i], 10);
			if (v1[i] > v2[i]) return 1;
			if (v1[i] < v2[i]) return -1;
		}
		return v1.length == v2.length ? 0 : (v1.length < v2.length ? -1 : 1);
	}

	const updateProList = (newRequirement) => {
		if (findIndex(installList, {plugin: newRequirement.plugin}) !== -1) {
			installList.push(newRequirement);
			setInstallList(installList);
		}
	}

	const collectMissingRequirements = () => {
		if (!itemData.requirements) return false;
		else {
			const supported_plugins = starterblocks.supported_plugins;
			console.log(itemData.requirements);
			for (let i = 0; i < itemData.requirements.length; i++) {
				let requirement = itemData.requirements[i];
				if (!supported_plugins.hasOwnProperty(requirement.plugin)) {
					updateInstallList(requirement);
				} else {
					let installedPlugin = supported_plugins[requirement.plugin];
					if (compareVersion(requirement.version, installedPlugin.version) === 1)
						updateVersionList(requirement);
					if (requirement.pro === true && installedPlugin.pro === false)
						updateProList(requirement);
				}
			}

			return false;
		}
	}

	collectMissingRequirements(); // This methods is different from the others, it updates the source of

	return (
		<div className="wp-full-overlay-sidebar-content">
			<div className="install-theme-info">
				<h3 className="theme-name">{name}</h3>
				<div className="theme-screenshot-wrap">
					<img className="theme-screenshot" src={image} alt=""/>{pro ?
						<span className="starterblocks-pro-badge">{__('Premium')}</span> : ''
					}</div>
				<div className="starterblocks-dependencies-list">
					<h4>Blocks Used</h4>
					{Object.keys(blocks).map((keyName, i) =>
						<div>
							<p className="starterblocks-dependency-blocks">
								{/*
									TODO - Add icon here if had in Icons, and append a link to it using
									starterblocks.supported_plugins[keyName] if had.
								*/}
								<span className="starterblocks-dependency-name">{starterblocks.supported_plugins[keyName].name}:</span>
								{
									sortBy(blocks[keyName]).map(function(item, index) {
										return <span>{ (index ? ', ' : '') + item }</span>;
									})
								}
							</p>
						</div>
					)}
				</div>
				<div className="requirements-list">
					<div className="list-type">
						{
							installList.length > 0 &&
							<div>
								<h4>Missing Plugins</h4>
								<ul>
									{installList.map(install => <li>{version.plugin}</li>)}
								</ul>
							</div>
						}
						{
							versionList.length > 0 &&
							<div>
								<h4>Version Mismatch</h4>
								<ul>
									{versionList.map(version => <li>{version.plugin}</li>)}
								</ul>
							</div>
						}
						{
							proList.length > 0 &&
							<div>
								<h4>Require to be pro</h4>
								<ul>
									{proList.map(pro => <li>{version.plugin}</li>)}
								</ul>
							</div>
						}
					</div>
				</div>
			</div>
		</div>
	);
}

export default SidebarContent;
