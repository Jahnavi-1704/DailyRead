import React, {useEffect, useState} from "react";
import {useLocation} from 'react-router-dom';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function SavedArticles() {

    useEffect(() => {
        console.log('Saved articles are:' + JSON.stringify(location.state.articles))
    }, [])

    let location = useLocation();
    const [userEmail, setUserEmail] = useState(location.state.email);
    const [articles, setArticles] = useState(location.state.articles);

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

    async function Unsubscribe (article) {
        let temp = [...articles];
        console.log('BEFORE TEMP IS:' + JSON.stringify(temp));
        
        let index = articles.find((element) => element.title == article.title);
        temp.splice(index, 1);
        setArticles(temp);

        console.log('AFTER TEMP IS: ' + JSON.stringify(temp));
        console.log('AFTER articles is: ' + JSON.stringify(articles));

        let url = 'http://localhost:5000/update/' + userEmail.toString();
        console.log(url);

        const editedUser = {
            email: userEmail,
            savedArticles: temp
        }
        console.log(editedUser);

        const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(editedUser),
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

    return (
        <div>
            {articles.length > 0 ?
                <div>
                    <div style={{textAlign: 'center', paddingTop: '20px', fontFamily: 'Garamond', fontSize: '40px'}}>
                        <text>Personal reading list</text>
                    </div>
                    <Box sx={{ flexGrow: 1, padding: '20px' }}>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            {articles.map((article) => (
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
                                            <Button variant="outlined" color="error" size="small" onClick={() => window.location.replace(article.url)}>Visit Site</Button>
                                            <Button variant="contained" color="error" size="small" onClick={() => Unsubscribe(article)}>Remove from list</Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </div>
                :
                <div style={{textAlign: 'center', paddingTop: '150px', fontFamily: 'Garamond', fontSize: '30px'}}>
                    <text>You currently have no saved articles</text>
                </div>
            }
        </div>
    );
}

export default SavedArticles;