import nltk
from nltk.tokenize import word_tokenize
from nltk.tag import pos_tag
import requests
from bs4 import BeautifulSoup
from requests_html import HTMLSession
import asyncio
from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

  
from fastapi import FastAPI
from typing import List, Optional
import uvicorn
from pydantic import BaseModel
from requests_html import AsyncHTMLSession
import nest_asyncio
import spacy

app = FastAPI()

class Item(BaseModel):
    conversations: list = []
    group_id : str

def process(sent):
    nlp_updated = spacy.load(output_dir)
    doc = nlp_updated(sent)
    [(ent.text, ent.label_) for ent in doc.ents]
    sent = nltk.word_tokenize(sent)
    sent = nltk.pos_tag(sent)
    tok_list = []
    for se in sent:
        if se[1]=='NN' or se[1]=='NNP':
            tok_list.append(se[0])
    return tok_list


def queryurl(tok_list):
  baseurl = "https://www.bajajfinservmarkets.in/emi-store/search.html?q="
  qurl = ""
  for tok in tok_list:
    qurl = qurl + tok + "%20"
  endurl = "&filter=city_id:1948&filter=feedType_uFilter:%22EMIStore"
  finalurl = baseurl + qurl + endurl
  return finalurl

print("###############")

async def render(url):
    nest_asyncio.apply()
    session = AsyncHTMLSession()
    #session = await AsyncHTMLSession()
    resp = await session.get(url)
    await resp.html.arender()
    html = resp.html.html
    soup = BeautifulSoup(html,"lxml")
    return soup


async def apireturn(conversations,group_id):
    queries = conversations
    produrl = []
    prodimageurl = []
    prodprice = []
    prodname = []
    credential = AzureKeyCredential(<API_KEY>)
    endpoint="https://centralindia.api.cognitive.microsoft.com/"

    text_analytics_client = TextAnalyticsClient(endpoint, credential)   
    for query in queries:
        sentiflag = 0
        response = text_analytics_client.analyze_sentiment([query], language="en")
        result = [doc for doc in response if not doc.is_error]

        for doc in result:
            if(doc.sentiment=='negative'):
                sentiflag = 1
        try:
            if(sentiflag==0):
                url = queryurl(process(query))
                soup = await render(url)
                try:
                    all = soup.find_all("ul",{"class":"cards--containawrapper search-page-sec"})[0]
                    purl = all.find("a").get("href")
                    if purl not in produrl:
                        produrl.append(purl)
                        print(purl)
                        pname = all.find_all("p",{"class":"PLP-prod-name-text"})[0].text
                        prodname.append(pname)
                        print(pname)
                        price = all.find_all("span",{"class":"PLP-finalPrice"})[0].text
                        prodprice.append(price)
                        print(price)
                        imgurl = all.find("img").get("src")
                        prodimageurl.append(imgurl)
                        print(imgurl)
                        try:
                            r = requests.post("https://www.api.apollox.atifhossain.me/recommendation/product/carousel", data={"produrl":purl,"prodimageurl":imgurl,"prodprice":price,"prodname":pname,"group_id":group_id})
                        except:
                            pass
                except:
                    pass
        except:
            pass

    print(produrl)
    print(prodimageurl)
    print(prodprice)
    print(prodname)

    return {"produrl":produrl,"prodimageurl":prodimageurl,"prodprice":prodprice,"prodname":prodname}


@app.get("/")
async def test():
    return "test" 

@app.post("/predict/")
async def create_item(item: Item):
    return await apireturn(item.conversations, item.group_id)
