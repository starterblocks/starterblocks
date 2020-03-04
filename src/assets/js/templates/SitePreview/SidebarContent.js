const { Component, useState } = wp.element
const {__} = wp.i18n

import findIndex from "lodash/findIndex";

function SidebarContent(props) {
    const {itemData} = props;
    const {name, image, pro} = itemData;
    const [installList, setInstallList] = useState([]);
    const [versionList, setVersionList] = useState([]);
    const [proList, setProList] = useState([]);
    console.log(itemData);

    const isProReason = () => {
        return (!starterblocks_admin.mokama && pro === true);
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
        console.log("update version list", versionList, index);
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
        for (let i = 0; i < k; ++ i) {
                v1[i] = parseInt(v1[i], 10);
                v2[i] = parseInt(v2[i], 10);
                if (v1[i] > v2[i]) return 1;
                if (v1[i] < v2[i]) return -1;        
        }
        return v1.length == v2.length ? 0: (v1.length < v2.length ? -1 : 1);
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
            const supported_plugins = starterblocks_admin.supported_plugins;
            console.log(itemData.requirements);
            for (let i = 0; i < itemData.requirements.length; i++) {
                let requirement = itemData.requirements[i];
                if (!supported_plugins.hasOwnProperty(requirement.plugin)){
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
                    <img className="theme-screenshot" src={image} alt="" />

                    { pro ?
                            <span class="starterblocks-pro-badge">{__('Pro')}</span> : ''
                    }

                </div>
                <div className="requirements-list" >
                    <div className="list-type">
                        {
                            installList.length > 0 &&
                            <ul>
                                Missing Plugins
                                {installList.map(install => <li>{version.plugin}</li>)}
                            </ul>
                        }
                        {
                            versionList.length > 0 &&
                            <ul>
                                Version Mismatch
                                {versionList.map(version => <li>{version.plugin}</li>)}
                            </ul>
                        }
                        {
                            proList.length > 0 &&
                            <ul>
                                Require to be pro
                                {proList.map(pro => <li>{version.plugin}</li>)}
                            </ul>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SidebarContent;