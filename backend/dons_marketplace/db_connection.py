import pymongo


url = "localhost:27017" #mongodb://
client = pymongo.MongoClient(url)

db = client['DonsMarketplace']