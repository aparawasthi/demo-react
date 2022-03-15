import React from 'react';
import { useState } from 'react';
import './Card.css';
import {getData} from '../utils/api';

function Card({user}) {
    const [userData, setUserData] = useState({username:user.login, button_text:"Details", collapse:true, repoLoaded: false, repos:[]});

    const CollapseAccordion = (event) => {
        if(!userData.repoLoaded){
            try {
                const username = userData.username;
                (async function () {
                    const response = await getData(`https://api.github.com/users/${username}/repos`);
                    setUserData(prevUserData => {return {...prevUserData, repos:response}});
                    console.log(response);
                }());
                setUserData(prevUserData => { return {...prevUserData, repoLoaded: true}});
                
            }catch(error){
                console.error(error);
            }
        }
        
        let button_text = "";
        if(userData.button_text === "Details"){
            button_text = "Collapse";
        } else{
            button_text = "Details";
        }
        setUserData(prevUserData => {return {...prevUserData, button_text, collapse: !userData.collapse}});

    }

    return (
        <div className='card-wrapper'>
            <div className='user-card flex flex-justify-space-between bg-white' id={user.login}>
                <div className='avatar'><img src={user.avatar_url} alt={user.login} /></div>
                <div className='user-details'>
                    <h3 className='fs-600'>{user.login}</h3>
                    <p>Profile URL : <a className='text-primary' href={user.html_url}>{user.html_url}</a></p>
                </div>
                <div className='user-button'>
                    <button className='text-primary bg-white' onClick={CollapseAccordion}>{userData.button_text}</button>
                </div>
            </div>
            <div className={'repos bg-white ' + (userData.collapse ? 'collapse':'show')}>
                {userData && <>
                    <div className='repo-header flex fw-bold'>
                        <div className='repo-name'>Repository Name</div>
                        <div className='repo-issues'>Open Issues</div>
                        <div className='repo-followers'>Followers</div>
                        <div className='repo-fork-count'>Forks</div>
                    </div>
                    {userData.repos.map(repo =>
                        <div className='repo-details flex' key={repo.id}>
                            <div className='repo-name'><a href={repo.html_url}>{repo.name}</a></div>
                            <div className='repo-issues'>{repo.open_issues_count}</div>
                            <div className='repo-followers'>{repo.watchers}</div>
                            <div className='repo-fork-count'>{repo.forks_count}</div>
                        </div>
                    )}
                </>}
            </div>
        </div>
    )
}

export default Card;