import './Content.css';
import TopConent from './Content/TopContent';
import LeftConent from './Content/LeftContent';
import RightConent from './Content/RightContent';

const Content = () => {
    return (
        <div className='main-content'>
            <TopConent />
            <LeftConent />
            <RightConent />
        </div>
    );
    };

export default Content;