from bs4 import BeautifulSoup
import requests

# initial and sections

url = 'https://www.nbcnews.com/'
response = requests.get(url, timeout=5)
content = BeautifulSoup(response.content, "html.parser")

links = []
for news in content.findAll('article', {'class':'tease-card'}):
    links.append(news.a['href'])
    print(news.a['href'])
    print(news.find('span', {'class': 'tease-card__headline'}).text)

    print('\n\n')

result = []
for link in links:
    page = requests.get(link)
    parsedData = BeautifulSoup(page.content)
    for data in parsedData.findAll('div', {'class': 'article_article__3xrIH article'}):
        print(data.find('h1', {'class': 'article-hero-headline__htag'}).text)
        print(data.find('time', {'class': 'relative z-1'}).text)

        authors = data.findAll('span', {'class': 'byline-name'})
                length = len(authors) / 2
                for index, author in enumerate(authors):
                    if(index >= length):
                        authors.pop(index)
        
        newList = []
        for author in authors:
            print(author.text)
            newList.append(author.text)

        description = data.find('div', {'class': 'styles_articleDek__Icz5H'})
        description = description.find(text=True)
        print(description)

        body = data.find('div', {'class': 'article-body__content'})
        content = ''
        for para in body.findAll('p'):
            print(para.text)
            content = content + para.text

        picture = data.find('picture')
        print(picture.img['src'])

        article = {
            'title': data.find('h1', {'class': 'article-hero-headline__htag'}).text,
            'author': newList,
            'date': data.find('time', {'class': 'relative z-1'}).text,
            'image': picture.img['src'],
            'cont': content,
            'desc': description
        }

        result.append(article)
        print(result)

# search based

url1 = 'https://www.nbcnews.com/search/?q=summer'
response1 = requests.get(url1, timeout=5)
content1 = BeautifulSoup(response1.content, "html.parser")

links1 = []
for news in content1.findAll('div', {'class':'gs-webResult gs-result'}):
    newDiv = news.find('div', {'class': 'gs-title'})
    print(newDiv.a['href'])