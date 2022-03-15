import React from 'react';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import Card from '../components/Card';
import {getData} from '../utils/api';
import './Home.css';

function Home({usersPerPage}) {
    const [totalUsers, setTotalUsers] = useState(0);
    const [users, setUsers] = useState([]);
    const [currentUsers, setCurrentUsers] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const username = useSelector(state => state.username);
    const sortBy = useSelector(state => state.sortBy);

    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        const timeout = setTimeout(async () => {
            (async function() {
                if(username){
                    const response = await getData(`https://api.github.com/search/users?q=${username.trim().toLowerCase()}`);
                    setUsers(response.items);
                    setTotalUsers(response.total_count);
                }else{
                    setUsers([]);
                    setTotalUsers(0);
                }
            })();
        }, 500);
        setDebounceTimeout(timeout);  
    }, [username])

    useEffect(() => {

        let sortedArray = [];
        if(sortBy === 'name-asc'){
            sortedArray = [...users].sort(function sort(a, b) {
                const userA = a.login.toUpperCase();
                const userB = b.login.toUpperCase();
                return (userA < userB) ? -1 : (userA > userB) ? 1 : 0;
            });
        }else if(sortBy === 'name-desc'){
            sortedArray = [...users].reverse();
        }

        setUsers(sortedArray);
        
    }, [sortBy])

    useEffect(() => {
        const endOffset = itemOffset + usersPerPage;
        setCurrentUsers(users.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(users.length / usersPerPage));
      }, [itemOffset, usersPerPage, users]);
    
      const handlePageClick = (event) => {
        const newOffset = (event.selected * usersPerPage) % users.length;
        setItemOffset(newOffset);
      };

    return (
        <main className='main container'>
            <p className='total-count fs-400'>Total Results : {totalUsers}</p>
            {currentUsers &&
                <>
                    {currentUsers.map(user => (
                        <Card user={user} key={user.id}/>
                    ))}
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=" >"
                        className="pagination"
                        activeClassName="active"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel="< "
                        renderOnZeroPageCount={null}
                    />
                </>
            }
        </main>
    )
}

export default Home;