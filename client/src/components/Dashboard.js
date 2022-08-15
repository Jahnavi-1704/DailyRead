import React, { useState, useEffect } from "react";
import {useLocation} from 'react-router-dom';
import SearchBar from "material-ui-search-bar";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import jwt_decode from 'jwt-decode';
import HomeIcon from '@mui/icons-material/Home';
import LoadingButton from '@mui/lab/LoadingButton';
import './style.css';

function Dashboard() {

    const location = useLocation();

    const [searchValue, setSearchValue] = useState(null);
    const [parsedData, setParsedData] = useState([]);
    const [logged, setLogged] = useState(location.state.logged);
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userPicture, setUserPicture] = useState(null);
    const [userArticles, setUserArticles] = useState([]);
    const [firstName, setFirstName] = useState(null);
    const [type, setType] = useState('latest');
    const [loading, setLoading] = useState(true);
    const [displayMessage, setDisplayMessage] = useState('Please wait a moment while we fetch the requested data');
    const [dataAvailable, setDataAvailable] = useState(false);

    let navigate = useNavigate();
    let userData = [];

    // 1st initial render
    useEffect(() => {
        if(logged) 
        {
            setUserName(location.state.name);
            setUserEmail(location.state.email);
            setUserPicture(location.state.picture);
            setFirstName(location.state.first);
        } 
        else 
        {
            /* global google */
            google.accounts.id.initialize({
                client_id: "1047047016732-j8s9f0t36aqqcs2hf4cnqtqj3fi2ckdn.apps.googleusercontent.com",
                callback: handleCallbackResponse
            });
        }

        // make API call to render initial general data
        getData(0);
    }, []);

    const getData = async (arg) => {
        if(type == 'latest')
        {
            getQueryData();
        }
        else
        {
            setDataAvailable(false);
            setLoading(true);
            setParsedData([]);

            let url = 'http://localhost:5000/type/' + type;

            const response = await fetch(url);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                console.log(message);
                setDisplayMessage('Oops, encountered a server error while fetching data!');
                setDataAvailable(false);
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log('Fetched data from backend');

            // if user had logged in, first getUserData and then parse fetched backend data to display
            // else just display the fetched backend data as it is without modifying
            let temp = null;
            if(logged) 
            {
                getUserData();
                console.log('FROM GET_DATA, savedarticles are: ' + JSON.stringify(userData));

                temp = [...data]; // or let temp = data;
                data.forEach((article, index) => {
                    article.saved = false;
                    userData.forEach((element) => {
                        if(element.title == article.title)
                        {
                            article.saved = true;
                            temp[index].saved = true;
                            console.log('MATCHED with saved article');
                        }
                    })
                    // console.log(JSON.stringify(article));
                });

                setParsedData(temp);
            }
            else 
            {
                temp = [...data]; // or let temp = data;
                data.forEach((article, index) => {
                    article.saved = false;
                    // console.log(JSON.stringify(article));
                    temp[index].saved = false;
                });

                setParsedData(temp);
            }

            console.log('GET_DATA fetching from : ' + url);
            console.log(JSON.stringify(temp));
            console.log(JSON.stringify(parsedData));

            if(data.length === 0)
            {
                console.log('No data available for the requested url');
                setDisplayMessage('Sorry, nothing matches your search...please try something else')
                setDataAvailable(false);
            }
            else 
            {
                setDisplayMessage('');
                setDataAvailable(true);
            }

            setLoading(false);
        }
    }

    // function which fetches user information if user has signed in from landing page
    async function getUserData () {
        let email = location.state.email;
        let url = 'http://localhost:5000/user/' + email.toString();

        const response = await fetch(url);
        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`;
            console.log(message);
            return;
        }

        const data = await response.json();

        console.log('GET_USER_DATA fetching from :' + url);
        console.log(JSON.stringify(data));
        console.log(data.savedArticles);

        setUserArticles(data.savedArticles);
        userData = data.savedArticles;
        console.log('USER ARTICLES ARE:' + JSON.stringify(userData));
    }

    // callback function to refetch data if type changes
    const getTypeData = (changedValue) => {
        setType(changedValue);
        setSearchValue('');
        setDataAvailable(false);
        setLoading(true);
        setParsedData([]);
        setDisplayMessage('Please wait a moment while we fetch the requested data');

        // call URL again to parse
        getData(0);
    }

    // callback function to refetch data if search query changes
    const getQueryData = async () => {
        setDataAvailable(false);
        setLoading(true);
        setParsedData([]);
        setDisplayMessage('Please wait a moment while we fetch the requested data');

        let url_base = 'https://newsdata.io/api/1/news?apikey=pub_1025774afb2c5ae891ef6141598605f5100c6&q=';
        let url = '';

        if(type == 'latest')
        {
            url = url_base + 'latest'; 
        }
        else
        {
            url = url_base + searchValue; 
        }

        const response = await fetch(url);
        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`;
            console.log(message);
            setDisplayMessage('Oops, encountered a server error while fetching data!');
            setDataAvailable(false);
            setLoading(false);
            return;
        }

        const data = await response.json();
        console.log('GET_QUERY_DATA fetching from : ' + url);
        console.log(JSON.stringify(data.results));

        let results = data.results;
        let temp = [];
        results.forEach((article) => {
            if(article.image_url)
            {
                let obj = {
                    'title': article.title,
                    'description': article.description,
                    'url': article.link,
                    'image': article.image_url,
                    'author': article.creator,
                    'content': article.content,
                    'date': (article.pubDate).toString()
                }
                temp.push(obj);
            }
        });

        let dataTemp = [...temp];

        console.log('AFTER CLEANING: ' + JSON.stringify(temp));

        if(logged) 
        {
            getUserData();
            console.log('FROM GET_DATA, savedarticles are: ' + JSON.stringify(userData));

            dataTemp.forEach((article, index) => {
                article.saved = false;
                userData.forEach((element) => {
                    if(element.title == article.title)
                    {
                        article.saved = true;
                        temp[index].saved = true;
                        console.log('Matched with saved article');
                    }
                })
            });

            setParsedData(temp);
        }
        else 
        {
            dataTemp.forEach((article, index) => {
                article.saved = false;
                temp[index].saved = false;
            });

            setParsedData(temp);
        }

        console.log(JSON.stringify(temp));
        console.log(JSON.stringify(parsedData));

        if(dataTemp.length === 0)
        {
            console.log('No data available for the requested url');
            setDisplayMessage('Sorry, nothing matches your search...please try something else')
            setDataAvailable(false);
        }
        else 
        {
            setDisplayMessage('');
            setDataAvailable(true);
        }

        setLoading(false);
    }

    // callback function which updates if article is saved/unsaved for user
    async function updateData (List) {
        let url = 'http://localhost:5000/update/' + userEmail.toString();
        console.log('UPDATE_DATA making request from : ' + url);

        const editedUser = {
            email: userEmail,
            savedArticles: List
        }

        const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(editedUser),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        // fetch the new updated articles
        // getData(1);
    }


    // --------------------- Normal functions ---------------------------
    // ------------------------------------------------------------------

    const cancelSearch = () => {
        setSearchValue(null);
        setDisplayMessage('Nothing to display...start reading');
        setDataAvailable(false);
    }

    const formatDate = (date) => {
        let newFormat = date.split('U');
        newFormat = newFormat[0];
        return newFormat;
    }

    const formatTitle = (title) => {
        let prevTitle = title;
        let newTitle = prevTitle.length > 60 ? prevTitle.substring(0, 57) + '...' : prevTitle;
        return newTitle;
    }

    const signOut = () => {
        setLogged('false');
        navigate('/');
    }

    const handleProfile = () => {
        if(logged) {
            navigate('/profile', {state: {name: userName, email: userEmail, picture: userPicture, firstName: firstName, articles: userArticles}});
        } else {
            alert('Please Sign in first!');
        }
    }

    const handleSaved = () => {
        if(logged) {
            navigate('/saved', {state: {email: userEmail, articles: userArticles, name: firstName}});
        } else {
            alert('Please Sign in first!');
        }
    }

    const subscribe = (article) => {
        console.log('IN SUBSCRIBE 1. userData:' + JSON.stringify(userData));
        console.log('IN SUBSCRIBE 2. userArticles:' + JSON.stringify(userArticles));

        let temp = [...userArticles];
        let savedIndex = temp.findIndex((element) => element.title == article.title);

        let tempBig = [...parsedData];
        let displayIndex = tempBig.findIndex((element) => element.title == article.title);

        if(savedIndex == -1)
        {
            // article not saved for user => save it
            // update current parsed data
            tempBig[displayIndex].saved = true;
            console.log(tempBig);
            setParsedData(tempBig);

            // update UserArticles by adding this to the list
            article.saved = true;
            temp.push(article);
            setUserArticles(temp);
            userData = temp;

            // call update API with this new list for userEmail
            updateData(temp);
        } else {
            tempBig[displayIndex].saved = false;
            setParsedData(tempBig);

            // update UserArticles by removing this from the list
            temp.splice(savedIndex, 1);
            setUserArticles(temp);
            userData = temp;

            // call update API with this new list for userEmail
            updateData(temp);
        }
    }

    // TODO: the code in this function doesn't work for signin button on dashboard...has to be fixed
    function handleCallbackResponse (response) {
        let userObject = jwt_decode(response.credential);
        setLogged(true);
        setUserName(userObject.name);
        setUserEmail(userObject.email);
        setUserPicture(userObject.picture);
    }

    return (
        <div>
            <Navbar bg="dark" variant="dark" fixed="top">
                <Container>
                    <Nav>
                        <div style={{borderRadius: '8', border: '1px bold blue', paddingTop: '5px', paddingBottom: '8px', paddingLeft: '50px'}}>
                            <SearchBar value={searchValue}
                                       onChange={(newSearch) => setSearchValue(newSearch)}
                                       onRequestSearch={() => getQueryData()}
                                       placeholder='Type to start searching...'
                                       onCancelSearch={() => cancelSearch()}
                                       style={{width: '600px'}}
                            />
                        </div>
                        <Nav.Link onClick={() => handleProfile()} style={{paddingTop: '15px', paddingLeft: '240px', fontSize: '18px'}}><HomeIcon fontSize="medium"/> Account</Nav.Link>
                        <Nav.Link onClick={() => handleSaved()} style={{paddingTop: '15px', paddingLeft: '15px', fontSize: '18px'}}><NotificationsActiveIcon fontSize="medium"/> Saved Articles</Nav.Link>
                        {logged ?
                            <Nav.Link onClick={() => signOut()} style={{paddingTop: '15px', paddingLeft: '15px', fontSize: '18px'}}>Signout</Nav.Link>
                            :
                            <Nav.Link style={{paddingTop: '15px', fontSize: '18px'}}>SignIn</Nav.Link>
                        }
                    </Nav>
                </Container>
            </Navbar>

            <div style={{display: 'flex', paddingTop: '100px', paddingLeft: '120px'}}>
                <div style={{paddingTop: '5px', fontSize: '15px'}}>
                    <text>Category</text>
                </div>
                <div style={{paddingLeft: '15px'}}>
                    <Button variant={type === 'latest' ? 'contained' : 'outlined'} color="primary" size="medium" onClick={() => getTypeData('latest')}>Latest</Button>
                </div>
                <div style={{paddingLeft: '15px'}}>
                    <Button variant={type === 'coronavirus' ? 'contained' : 'outlined'} color="primary" size="medium" onClick={() => getTypeData('coronavirus')}>Coronavirus</Button>
                </div>
                <div style={{paddingLeft: '15px'}}>
                    <Button variant={type === 'world' ? 'contained' : 'outlined'} color="primary" size="medium" onClick={() => getTypeData('world')}>World</Button>
                </div>
                <div style={{paddingLeft: '15px'}}>
                    <Button variant={type === 'business' ? 'contained' : 'outlined'} color="primary" size="medium" onClick={() => getTypeData('business')}>Business</Button>
                </div>
                <div style={{paddingLeft: '15px'}}>
                    <Button variant={type === 'politics' ? 'contained' : 'outlined'} color="primary" size="medium" onClick={() => getTypeData('politics')}>Politics</Button>
                </div>
                <div style={{paddingLeft: '15px'}}>
                    <Button variant={type === 'health' ? 'contained' : 'outlined'} color="primary" size="medium" onClick={() => getTypeData('health')}>Health</Button>
                </div>
                <div style={{paddingLeft: '15px'}}>
                    <Button variant={type === 'science' ? 'contained' : 'outlined'} color="primary" size="medium" onClick={() => getTypeData('science')}>Science</Button>
                </div>
                <div style={{paddingLeft: '15px'}}>
                    <Button variant={type === 'weather' ? 'contained' : 'outlined'} color="primary" size="medium" onClick={() => getTypeData('weather')}>Weather</Button>
                </div>
                <div style={{paddingLeft: '15px'}}>
                    <Button variant={type === 'tech-media' ? 'contained' : 'outlined'} color="primary" size="medium" onClick={() => getTypeData('tech-media')}>Tech & Media</Button>
                </div>
            </div>

            {loading ?
                <div style={{textAlign: 'center', paddingTop: '100px', fontFamily: 'Garamond', fontSize: '30px'}}>
                    <div className="stage">
                        <div className="dot-pulse"></div>
                    </div>
                    <text>{displayMessage}</text>
                </div>
                :
                null
            }

            {!loading && !dataAvailable ?
                <div style={{textAlign: 'center', paddingTop: '150px', fontFamily: 'Garamond', fontSize: '30px'}}>
                    <text>{displayMessage}</text>
                </div>
                :
                null
            }

            {!loading && dataAvailable ?
                <Box sx={{ flexGrow: 1, padding: '20px' }}>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {parsedData.map((article) => (
                            <Grid item xs={2} sm={4} md={4}>
                                <Card sx={{ minWidth: '450px', padding: '10px', height: '375px', paddingBottom: '8px'}} raised={true} variant="elevation" elevation={15}>
                                    <CardHeader title={formatTitle(article.title)}
                                                subheader={formatDate(article.date)}
                                    >
                                    </CardHeader>

                                    {article.image ?
                                        <CardMedia
                                            component="img"
                                            height="194"
                                            image={article.image}
                                            alt="articleImage"
                                        />
                                        :
                                        <CardContent>
                                            <Typography variant="body2" color="text.secondary">
                                                {article.description}
                                            </Typography>
                                        </CardContent>
                                    }

                                    <CardActions>
                                        <Button variant="outlined" color="error" size="small" onClick={() => subscribe(article)}>{article.saved ? 'Unsave' : 'Save'}</Button>
                                        <Button variant="outlined" color="error" size="small" onClick={() => navigate('/article', {state:{name: article.title, author: article.author, description: article.description, date: formatDate(article.date), content: article.content, image: article.image, url: article.url}})}>Read More</Button>
                                        <Button variant="contained" color="error" size="small" onClick={() => window.location.replace(article.url)}>Visit Site</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                :
                null
            }




        </div>
    );
}

export default Dashboard;