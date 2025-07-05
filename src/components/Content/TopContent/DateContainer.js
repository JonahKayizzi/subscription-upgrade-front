import './DateContainer.css';

const DateContainer = () => {


    return (
        <div className='date'>
            <h1>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h1>
        </div>
    );
};

export default DateContainer;