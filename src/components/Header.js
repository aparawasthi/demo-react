import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {actions} from '../store';
import './Header.css';

function Header() {

  const username = useSelector(state => state.username);

  const dispatch = useDispatch();

  const submitUsername = (event) => {
    //dispatch({type:'CHANGE', username:event.target.value});
    dispatch(actions.updateUsername(event.target.value));
  }

  const handleSortBy = (event) => {
    dispatch(actions.updateSortBy(event.target.value));
  }

  return (
    <header className='header bg-primary flex flex-align-center'>
        <div className='container flex'>
            <select id='sortBy' className='form-field fs-400' name='sortBy' onChange={handleSortBy}>
                <option value='name-asc'>Name (A - Z)</option>
                <option value='name-desc'>Name (Z - A)</option>
                <option value='rank-up'>Rank ↑</option>
                <option value='rank-down'> Rank ↓</option>
            </select>
            <input id='username' className='form-field fs-400' type='text' value={username} onChange={submitUsername} name='username' placeholder='Search By Username' />
        </div>
    </header>
  )
}

export default Header