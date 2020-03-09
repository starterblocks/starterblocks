const getPluginInstance = (pluginKey) => {
	return starterblocks.supported_plugins[pluginKey];
}

const needsPluginInstall = (pluginKey) => {
	return getPluginInstance(pluginKey).hasOwnProperty('version') === false;
}

const needsPluginPro = (pluginKey) => {
	const pluginInstance = getPluginInstance(pluginKey);
	return (pluginInstance.hasOwnProperty('has_pro') && (pluginInstance.hasOwnProperty('is_pro') === false));
}

const checkTemplateDependencies = (data) => {
	let missingPluginArray = [], missingProArray = [];
	// Template itself check
	if (data.pro) {
		if (!starterblocks.mokama && data.source === 'starterblocks')
			missingProArray.push('starterblocks');

		if (data.source !== 'starterblocks' && needsPluginPro(data.source))
			missingProArray.push(data.source);
	}

	if (data.source !== 'starterblocks' && needsPluginInstall(data.source))
		missingPluginArray.push(data.source);

	// dependency blocks check
	Object.keys(data.blocks).forEach(pluginKey => {
		if (needsPluginInstall(pluginKey)) missingPluginArray.push(pluginKey);
		if (needsPluginPro(pluginKey) && data.blocks[pluginKey].pro) missingProArray.push(pluginKey);
	});
	return {missingPluginArray, missingProArray};
}

const pluginInfo = (pluginKey) => {
	const pluginInstance = getPluginInstance(pluginKey);
	if (!pluginInstance) return {name: null, slug: null, url: null};
	const name = pluginInstance.name;
	const slug = pluginInstance.slug ? pluginInstance.slug : pluginKey;
	const url = pluginInstance.url;
	return {name, slug, url};
}

export default {checkTemplateDependencies, pluginInfo};
