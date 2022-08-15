import React, {useEffect} from "react";
import {useLocation} from 'react-router-dom';
import Button from '@mui/material/Button';
import LaunchIcon from '@mui/icons-material/Launch';
import moment from 'moment';
function Article() {

    const location = useLocation();
    let date = location.state.date;
    let content = location.state.content;

    useEffect(() => {
        console.log(location.state);

        async function fetchHTML () {
            let url = location.state.url;
            const response = await fetch(url,{
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if(!response.ok) {
                console.log("error occurred");
            }

            const data = await response.json();

            console.log(data);
        }

        fetchHTML();
    });

    const formatAuthor = (authorList) => {
        let newList = '';
        authorList.forEach((author, index) => {
            if(index > 1)
            {
                newList = newList + ', ' + author;
            }
            else 
            {
                newList = author;
            }
        })
        return newList;
    }

    return (
        <div style={{padding: '30px', paddingLeft: '50px', paddingRight: '50px'}}>
            <div style={{fontFamily: 'Garamond', fontSize: '40px', fontWeight: 'bolder'}}>
                <text>{location.state.name}</text>
                <Button variant="contained" endIcon={<LaunchIcon />} size="medium" color="error" sx={{marginLeft: '20px', marginBottom: '10px'}} onClick={() => window.location.replace(location.state.url)}>Visit Website</Button>
            </div>

            <div style={{fontSize: '25px', paddingTop: '10px', color: 'grey', fontFamily: 'Garamond'}}>
                <text>{location.state.description}</text>
            </div>

            <div style={{fontSize: '15px', paddingTop: '10px', color: 'grey', fontFamily: 'Garamond'}}>
                    <text>By {formatAuthor(location.state.author)}</text>
            </div>

            {date ? 
                <div style={{fontSize: '15px', paddingTop: '2px', color: 'grey', fontFamily: 'Garamond'}}>
                    <text>{date}</text>
                </div>
                :
                null
            }

            <div style={{paddingTop: '10px'}}>
                <img src={location.state.image} />
            </div>

            {content ?
                <div style={{paddingTop: '30px', fontFamily: 'Garamond', fontSize: '22px'}}>
                    <text>{content}</text>
                </div>
                :
                null
            }


        </div>
    );
}

export default Article;