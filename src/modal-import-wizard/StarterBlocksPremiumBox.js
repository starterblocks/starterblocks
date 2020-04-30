const {Component} = wp.element;

export default function StarterBlocksPremiumBox(props) {
    return (
        <div className="starterblocks-modal-body">
            <div class="section-box premium-box">
                <h3>🚀 StarterBlocks Premium</h3>
                <p><b>Priority Email & Forum Support</b></p>
                <ul>
                    <li><strong>Weekly</strong>Updates to the Library</li>
                    <li><strong>Unlimited</strong>Library Access</li>
                    <li><strong>20+</strong>Collections</li>
                    <li><strong>125+</strong>Page Templates</li>
                    <li><strong>250+</strong>Section Templates</li>
                    <li><strong>Priority</strong>Support</li>
                </ul>
                <p>
                    <a href="/wp-admin/admin.php?billing_cycle=annual&page=starterblocks-pricing&utm_source=welcome&utm_medium=settings&utm_campaign=sidebar&utm_campaign=sidebar"
                       class="components-button" title="Get StarterBlocks Pro">Upgrade Now</a>
                </p>
            </div>
        </div>
    );
}
