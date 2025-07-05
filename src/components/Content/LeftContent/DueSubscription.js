import './DueSubscription.css'
import logo from '../../../assets/images/logo.png'
import SubscriptionStatusBar from './../../Utility/SubscriptionStatusBar'

const DueSubscription = () => {

    const subscriptions = [
        {
                    "logo":logo,
                    "subcriber_name":"Subscriber 1",
                    "due_date":"2025-09-01",
                    sub_status:{
                        "eAIP":2,
                        "CD":2,
                        "Paper":0,
                    }
        },
        {
                    "logo":logo,
                    "subcriber_name":"Subscriber 2",
                    "due_date":"2026-09-01",
                    sub_status:{
                        "eAIP":2,
                        "CD":2,
                        "Paper":0,
                    },
                },
        {
                    "logo":logo,
                    "subcriber_name":"Subscriber 3",
                    "due_date":"2025-02-01",
                    sub_status:{
                        "eAIP":2,
                        "CD":2,
                        "Paper":2,
                   },
        },
        {
                    "logo":logo,
                    "subcriber_name":"Subscriber 4",
                    "due_date":"2025-01-01",
                    sub_status:{
                        "eAIP":0,
                        "CD":2,
                        "Paper":2,
                    }
        },
    ]
    return (
        <div className="due-subscription">
            <h2>Due Subscription</h2>
            <div className="due-subscription-content">
                <p>6 subscriptions due</p>
                <div className="due-subscription-content-item">
                    <p></p>
                    <div className="due-subscription-content-item-status">
                        {/** Call subscription component and pass subscription status */}
                        <p className='subscription-status'>eAIP</p>
                        <p className='subscription-status'>CD</p>
                        <p className='subscription-status'>Paper</p>
                    </div>
                </div>
                {subscriptions.map((subscription) => {
                    return (
                        <div key={subscription.subcriber_name} className="due-subscription-content-item">
                            <img style={{"width":"10%","borderRadius":"50%"}} className="subscriber.logo" src={subscription.logo} alt="logo" />
                            <h3>{subscription.subcriber_name}</h3>
                            {/* Compute number of years, months, weeks or days left*/}
                            {(() => {
                                const days_left = Math.floor((new Date(subscription.due_date) - new Date()) / (1000 * 60 * 60 * 24));
                                return (
                                    <>
                                        <p>{
                                            days_left > 365 ? Math.floor(days_left / 365) + (days_left > 730 ? " years left" : " year left") :
                                            days_left > 30 ? Math.floor((days_left % 365) / 30) + (days_left > 60 ? " months left" : " month left") :
                                            days_left > 7 ? Math.floor(((days_left % 365) % 30) / 7) + (days_left > 14 ? " weeks left" : " week left") :
                                            Math.floor(((days_left % 365) % 30) % 7) + (days_left > 1 ? " days left" : " day left")
                                        }</p>
                                        <div className="due-subscription-content-item-status">
                                            {/** Call subscription component and pass subscription status */}
                                            <p className='subscription-status'><SubscriptionStatusBar days_left={days_left}/></p>
                                            <p className='subscription-status'><SubscriptionStatusBar days_left={days_left}/></p>
                                            <p className='subscription-status'><SubscriptionStatusBar days_left={days_left}/></p>
                                        </div>
                                    </>
                                )
                            })()}
                            </div>
                    )
                })}
            </div>
        </div>
    )
}

export default DueSubscription