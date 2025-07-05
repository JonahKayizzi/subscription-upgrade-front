import './SubscriptionOverview.css';

const SubscriptionOverview = ({ title, number }) => {
    return (
        <div className='subscription-overview'>
            <h2>{title}</h2>
            <p>{number}</p>
        </div>
    )
}

export default SubscriptionOverview