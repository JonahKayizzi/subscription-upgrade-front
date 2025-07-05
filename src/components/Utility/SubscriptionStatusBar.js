import './SubscriptionStatusBar.css';

const SubscriptionStatusBar = ({days_left}) => {
    return (
        <div className="subscription-status-bar">
            {/** Create status with progress bar reflecting the number of days left
             * 0-30 days: red
             * 31-60 days: yellow
             * 61+ days: green
             * 365+ days: dark green
             */}
            {(() => {
                const sub_status = days_left > 365 ? 3 : days_left > 60 ? 2 : days_left > 30 ? 1 : 0;
                const width = days_left > 365 ? 100 : days_left/365*100;
                return (
                    <>
                        {sub_status === 0 && <div style={{"width":`${width}%`}} className="status-bar status-bar-red"></div>}
                        {sub_status === 1 && <div style={{"width":`${width}%`}} className="status-bar status-bar-yellow"></div>}
                        {sub_status === 2 && <div style={{"width":`${width}%`}} className="status-bar status-bar-green"></div>}
                        {sub_status === 3 && <div style={{"width":`${width}%`}} className="status-bar status-bar-dark-green"></div>}
                    </>
                );
            })()}
        </div>
    )
}

export default SubscriptionStatusBar;