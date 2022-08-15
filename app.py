from flask import Flask, send_from_directory, render_template, request, jsonify
from flask_restful import Api, Resource, reqparse
import pymongo
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS #comment this on deployment
from bs4 import BeautifulSoup
import requests
import json

app = Flask(__name__, static_url_path='', static_folder='client/build')
client = pymongo.MongoClient("mongodb+srv://Jahnavi17:IwillgetintoFAANG@dailyread.ppzmt.mongodb.net/?retryWrites=true&w=majority")
db = client.test
collection = db.users
CORS(app) #comment this on deployment
api = Api(app)

@app.route("/", defaults={'path':''})
def serve(path):
    return send_from_directory(app.static_folder,'index.html')

@app.route('/type/<string:type>', methods=['GET'])
def datafuncOne(type):
    
    # Scrape all data from requested URL
    temp1 = 'latest'
    temp2 = 'coronavirus'
    if request.method == 'GET':
        url = 'https://www.nbcnews.com/' + type

        if type == temp1:
            url = 'https://www.nbcnews.com/latest-stories/'

        if type == temp2:
            url = 'https://www.nbcnews.com/health/coronavirus'
            
        # print('URL fetching is:' + url)

        try:
            response = requests.get(url, timeout=5)
        except requests.exceptions.ReadTimeout:
            response = requests.get(url, timeout=5)

        content = BeautifulSoup(response.content, "html.parser")
        # print('Content fetching is: ' + str(content))

        links = []
        for news in content.findAll('article', {'class':'tease-card'}):
            links.append(news.a['href'])
        
        result = []
        for link in links:
            page = requests.get(link)
            parsedData = BeautifulSoup(page.content)
            for data in parsedData.findAll('div', {'class': 'article_article__3xrIH article'}):
                authors = data.findAll('span', {'class': 'byline-name'})
                authors = set(authors)

                temp = set()
                for x in data.findAll('span', {'class': 'byline-name'}):
                    temp.add(x.text)
                temp = list(temp)

                authorList = []
                for author in authors:
                    authorList.append(author.text)

                description = data.find('div', {'class': 'styles_articleDek__Icz5H'})
                description = description.find(text=True)

                body = data.find('div', {'class': 'article-body__content'})
                content = ''
                for para in body.findAll('p'):
                    content = content + para.text

                picture = data.find('picture')

                date = data.find('time', {'class': 'relative z-1'}).text
                print('DATE IS: ' + date)

                article = {
                    'title': data.find('h1', {'class': 'article-hero-headline__htag'}).text,
                    'author': temp,
                    'date': date,
                    'image': picture.img['src'],
                    'content': content,
                    'description': description,
                    'url': link
                }
                result.append(article)

        # print(result)
        # print('\n # Scrape type successful # \n')
        return jsonify(result)

@app.route('/user/<string:email>', methods=['GET'])
def datafuncThree(email):
    # GET information about a specific user by email
    if request.method == 'GET':
        query = { 'email': email }
        data = collection.find_one(query)
        # print(data)

        if not data:
            print('No user exists in database, creating new entry')
            newUser = {
                "email":email,
                "savedArticles":[],
            }
            collection.insert_one(newUser)

        # print('\n # Fetch user successful # \n')
        # print(json.dumps(data, default=str))
        return json.dumps(data, default=str)

@app.route('/update/<string:email>', methods=['PUT'])
def datafuncFour(email):
    # UPDATE a user's information by email
    if request.method == 'PUT':
        body = request.json
        email = body['email']
        savedArticles = body['savedArticles']

        query = { 'email': email }
        updatedUser = {
            "email":email,
            "savedArticles":savedArticles,
        }

        # print('User has updated his articles list:')
        # print(savedArticles)

        collection.replace_one(query, updatedUser)

        # print('\n # Update successful # \n')
        return jsonify({'status': 'User: ' + email + ' is updated!'})

if __name__ == '__main__':
    app.debug = True
    app.run()