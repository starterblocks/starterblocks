const {Component} = wp.element;

export default function StarterBlocksPremiumBox(props) {
    return (
        <div className="starterblocks-modal-body">
            <div class="section-box premium-box">
                <h3>{__('StarterBlocks Premium is Required', 'starterblocks')}</h3>

                <p>{__('Upgrade now to use this template and enjoy these benefits:', 'starterblocks')}</p>
                <ul>
                    <li><strong>Frequent</strong> Updates to the Library</li>
                    <li><strong>Unlimited</strong> Library Access</li>
                    <li><strong>500+</strong> Section Templates</li>
                    <li><strong>125+</strong> Page Templates</li>
                    <li><strong>20+</strong> Collections</li>
                </ul>
                <p>
                    <a href={starterblocks.u} class="starterblocks-upgrade-button" title="StarterBlocks Premium"
                       target='_blank'>{__('Upgrade Now', 'starterblocks')}</a>
                </p>
            </div>
        </div>
    );
}
