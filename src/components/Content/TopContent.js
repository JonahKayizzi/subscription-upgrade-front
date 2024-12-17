import './TopContent.css';
import Search from './TopContent/Search';
import Date from './TopContent/DateContainer';

const TopContent = () => {
    return (
        <div className='top-content'>
            <Search />
            <Date />
        </div>
    );
};

export default TopContent;