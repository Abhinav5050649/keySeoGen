from fastapi import FastAPI, HTTPException
import requests
from bs4 import BeautifulSoup
from collections import Counter
import re

app = FastAPI()

from fastapi import FastAPI, HTTPException
import requests
from bs4 import BeautifulSoup
from collections import Counter

app = FastAPI()

def scrape_google(search_param, num_pages=5):
    base_url = "https://www.google.com/search"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}

    all_results = []

    for page in range(num_pages):
        start = page * 10
        url = f"{base_url}?q={search_param}&start={start}"

        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            results = soup.find_all("h3")  # Adjust this selector based on the actual structure of Google search results
            all_results.extend(results)
        else:
            raise HTTPException(status_code=500, detail="Failed to fetch Google search results")

    return all_results

def extract_keywords(results, num_keywords=10):
    keywords = []
    for result in results:
        text = result.get_text()
        words = re.findall(r'\b\w+\b', text)
        keywords.extend(words)
    
    keyword_counter = Counter(keywords)
    top_keywords = keyword_counter.most_common(num_keywords)
    return top_keywords

@app.post("/scrape-google/")
async def scrape_google_keywords(search_param: str):
    try:
        results = scrape_google(search_param, num_pages=10)  # Change num_pages to 10
        top_keywords = extract_keywords(results)
        
        response_data = []
        keywords=[]
        for keyword, frequency in top_keywords:
            response_data.append({"keyword": keyword, "frequency": frequency})
            keywords.append(keyword)

        print(keywords)

        with open('keywords.txt','w') as file:
            file.writelines(str(response_data))
        
        file.close()
        
        return {"search_param": search_param, "top_keywords": response_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# def scrape_google(search_param):
#     url = f"https://www.google.com/search?q={search_param}"
#     headers = {
#         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}
    
#     response = requests.get(url, headers=headers)
#     if response.status_code == 200:
#         soup = BeautifulSoup(response.text, "html.parser")
#         results = soup.find_all("h3")  # Adjust this selector based on the actual structure of Google search results
#         return results
#     else:
#         raise HTTPException(status_code=500, detail="Failed to fetch Google search results")

# def extract_keywords(results, num_keywords=5):
#     keywords = []
#     for result in results:
#         text = result.get_text()
#         keywords.extend(text.split())
    
#     keyword_counter = Counter(keywords)
#     top_keywords = keyword_counter.most_common(num_keywords)
#     return top_keywords

# @app.post("/scrape-google/")
# async def scrape_google_keywords(search_param: str):
#     try:
#         results = scrape_google(search_param)
#         top_keywords = extract_keywords(results)
        
#         response_data = []
#         for keyword, frequency in top_keywords:
#             response_data.append({"keyword": keyword, "frequency": frequency})
        
#         return {"search_param": search_param, "top_keywords": response_data}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
