import './SubscriptionStatistics.css';
import SubscriptionOverview from './SubscriptionOverview';

const SubscriptionStatistics = () => {
    return (
        <div className='subscription-statistics'>
            <h1 className='overview-heading'>Current Subscription Overview</h1>
            <div className='subscription-overview'>
                    <SubscriptionOverview title='New Subscriptions' number='5' />
                    <SubscriptionOverview title='Currently Active' number='45' />
                    <SubscriptionOverview title='Expiring this month' number='4' />
                    <SubscriptionOverview title='Expiring next month' number='6' />
                    <SubscriptionOverview title='Overdue' number='2' />
                    <SubscriptionOverview title='Inactive' number='3' />
            </div>
        </div>        
    )
}

export default SubscriptionStatistics