import React from 'react';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import Card from '../components/Card';
import { getData } from '../utils/api';
import './Home.css';

const sortUsers = (users, field, desc = false) => {
  let sortedArray = [...users];
  const reverse = !desc ? 1 : -1;
  if (field === 'name') {
    sortedArray = [...users].sort(function sort(a, b) {
      const userA = a.login.toUpperCase();
      const userB = b.login.toUpperCase();
      return reverse * (userA < userB ? -1 : userA > userB ? 1 : 0);
    });
  } else if (field === 'rank') {
    sortedArray = [...users];
  }
  return sortedArray;
};

function Home({ usersPerPage }) {
  const [totalUsers, setTotalUsers] = useState(0);
  const [users, setUsers] = useState([]);
  const [currentUsers, setCurrentUsers] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const username = useSelector((state) => state.username);
  const sortBy = useSelector((state) => state.sortBy);

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeout = setTimeout(async () => {
      (async function () {
        if (username) {
          const response = await getData(
            `https://api.github.com/search/users?q=${username
              .trim()
              .toLowerCase()}`
          );
          // const fetchedUsers = response.items.map(async (user) => {
          //     const res = await getData(user.url);
          //     console.log({...res, score:user.score});
          // });
          setUsers(response.items);
          setTotalUsers(response.total_count);
        } else {
          setUsers([]);
          setTotalUsers(0);
        }
      })();
    }, 500);
    setDebounceTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  useEffect(() => {
    let dataArray = [];
    if (sortBy === 'name-asc') {
      dataArray = sortUsers(users, 'name');
    } else if (sortBy === 'name-desc') {
      dataArray = sortUsers(users, 'name', true);
    } else if (sortBy === 'rank-up') {
      dataArray = sortUsers(users, 'rank');
    } else if (sortBy === 'rank-down') {
      dataArray = sortUsers(users, 'rank', true);
    }

    setUsers(dataArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, username]);

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
    <main className="main container">
      <p className="total-count fs-400">Total Results : {totalUsers}</p>
      {currentUsers && (
        <>
          {currentUsers.map((user) => (
            <Card user={user} key={user.id} />
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
      )}
    </main>
  );
}

export default Home;
