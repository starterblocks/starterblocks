export const getPluginInstance = (pluginKey) => {
    if (pluginKey in starterblocks.supported_plugins) {
        return starterblocks.supported_plugins[pluginKey];
    }
    return false; // Deal with unknown plugins
}

export const needsPluginInstall = (pluginKey) => {
    const pluginInstance = getPluginInstance(pluginKey);
    return !pluginInstance || pluginInstance.hasOwnProperty('version') === false;
}

export const needsPluginPro = (pluginKey) => {
    const pluginInstance = getPluginInstance(pluginKey);
    return (pluginInstance && pluginInstance.hasOwnProperty('has_pro') && pluginInstance.has_pro &&
        (pluginInstance.hasOwnProperty('is_pro') === false || pluginInstance.is_pro === false));
}


export const pluginInfo = (pluginKey) => {
    let pluginInstance = processPlugin(pluginKey);
    if (!pluginInstance) return {name: null, slug: null, url: null};
    return pluginInstance
}


export const processPlugin = (pluginKey) => {
    let pluginInstance = {...getPluginInstance(pluginKey)};
    if (!pluginInstance) {
        return pluginInstance
    }

    if ('free_slug' in pluginInstance && pluginInstance['free_slug'] in starterblocks.supported_plugins) {
        let new_instance = {...getPluginInstance(pluginInstance.free_slug)}
        new_instance.free_slug = pluginInstance.free_slug
        new_instance.name = pluginInstance.name
        if (!('is_pro' in new_instance)) {
            delete new_instance.version
        }
        pluginInstance = new_instance
    }
    pluginInstance.slug = pluginInstance.slug ? pluginInstance.slug : pluginKey;
    if (!('url' in pluginInstance)) {
        if (!('wp_org' in pluginInstance)) {
            pluginInstance.url = 'https://wordpress.org/plugins/' + pluginKey
        }
    }

    return pluginInstance
}

