import { useEffect, useState, useRef } from 'react';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';

import * as searchServices from '~/services/searchService';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountItem from '~/components/AccountItem';
import { SearchIcon } from '~/components/Icons';
import { useDebounce } from '~/hooks';
import styles from './Search.module.scss';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';



const cx = classNames.bind(styles);

function Search() {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [searchedProjects, setSearchedProjects] = useState([]);

    const debouncedValue = useDebounce(searchValue, 500);

    const inputRef = useRef();

    useEffect(() => {
        
        if (!searchValue.trim()) {
            setSearchResult([]);
            return;
        }
        const fetchApi = async () => {
            setLoading(true);
            try {
                const result = await axios.get(`https://capstone-matching.herokuapp.com/api/v1/projects/home?project_name=${searchValue}`);
                setSearchResult(result.data.projects.rows);
                setSearchedProjects(result.data.projects.rows);
                console.log(result.data.projects.rows);
                setLoading(false);
                setError(null);
            } catch (err) {
                setLoading(false);
                setError(err.message);
            }
    };
    fetchApi();
    }, [searchValue]);
    
    const handleChange = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
        setSearchValue(searchValue);
        }
        };

    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);
        inputRef.current.focus();
    };

    const handleHideResult = () => {
        setShowResult(false);
    };
     const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            setShowResult(true);
        }
    };

    const handleSearch = () => {
        navigate('/', { state: { searchedProjects } });
        window.location.reload();
      };

    return (
        <div>
            <HeadlessTippy
                interactive
                visible={showResult && searchResult.length > 0}
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            {error && <div>{error}</div>}
                            {!error && searchResult.length === 0 && <div>No results found.</div>}
                            {!error && searchResult.length > 0 && (
                            <>
                            <h4 className={cx('search-title')}>Name Project</h4>
                            
                            {searchResult.map((item) => {
                                return (
                                <div className={cx('search-popups')}>
                                <h4><Link to={`/projectDetail/${item.project_id}`}>{item.project_name}</Link></h4>
                                </div>
                                );
                            }                                
                            )}
                            </>
                              )}
                        </PopperWrapper>
                    </div>
                )}
                onClickOutside={handleHideResult}
            >
                <div className={cx('search')}>
                    <input
                        ref={inputRef}
                        value={searchValue}
                        placeholder="Search accounts and projects"
                        spellCheck={false}
                        onChange={handleChange}
                        onFocus={() => setShowResult(true)}
                        onKeyDown={handleKeyDown}
                    />
                    {!!searchValue && !loading && (
                        <button className={cx('clear')} onClick={handleClear}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    )}
                    {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}

                    <button className={cx('search-btn')} onClick={handleSearch} onMouseDown={(e) => e.preventDefault()}>
                        <SearchIcon />
                    </button>
                </div>
            </HeadlessTippy>
        </div>
    );
}

export default Search;
