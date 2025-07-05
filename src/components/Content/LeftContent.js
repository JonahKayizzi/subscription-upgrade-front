import './LeftContent.css';
import DueSubscription from './LeftContent/DueSubscription';
import SubInf from './LeftContent/SubInf'

const LeftContent = () => {
    return (
        <div className='left-content'>
            <SubInf />
            <DueSubscription />
        </div>
    );
};

export default LeftContent;