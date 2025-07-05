import React from 'react';
import './Content.css';
import TopConent from './Content/TopContent';
import LeftConent from './Content/LeftContent';
import RightConent from './Content/RightContent';
import SubscribersTable from './SubscribersTable';
import SubscriptionsTable from './SubscriptionsTable';

const Content = () => {
    return (
        <div style={{ padding: '32px', display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 350 }}>
                <SubscribersTable />
            </div>
            <div style={{ flex: 2, minWidth: 350 }}>
                <SubscriptionsTable />
            </div>
        </div>
    );
};

export default Content;