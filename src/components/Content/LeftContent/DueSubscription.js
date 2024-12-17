import './DueSubscription.css'
import logo from '../../../assets/images/logo.png'

const DueSubscription = () => {

    const subscriptions = [
        {
                    "logo":logo,
                    "subcriber_name":"Subscriber 1",
                    "due_date":"2021-09-01",
                    sub_status:{
                        "eAIP":2,
                        "CD":2,
                        "Paper":0,
                    }
        },
        {
                    "logo":logo,
                    "subcriber_name":"Subscriber 2",
                    "due_date":"2021-09-01",
                    sub_status:{
                        "eAIP":2,
                        "CD":2,
                        "Paper":0,
                    },
                },
        {
                    "logo":logo,
                    "subcriber_name":"Subscriber 3",
                    "due_date":"2021-09-01",
                    sub_status:{
                        "eAIP":2,
                        "CD":2,
                        "Paper":2,
                   },
        },
        {
                    "logo":logo,
                    "subcriber_name":"Subscriber 4",
                    "due_date":"2021-09-01",
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
                {subscriptions.map((subscription) => {
                    return (
                        <div key={subscription.subcriber_name} className="due-subscription-content-item">
                            <img style={{"width":"10%","borderRadius":"50%"}} className="subscriber.logo" src={subscription.logo} alt="logo" />
                            <h3>{subscription.subcriber_name}</h3>
                            <p>Due Date: {subscription.due_date}</p>
                            <div className="due-subscription-content-item-status">
                                <p>eAIP: {subscription.sub_status.eAIP}</p>
                                <p>CD: {subscription.sub_status.CD}</p>
                                <p>Paper: {subscription.sub_status.Paper}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default DueSubscription