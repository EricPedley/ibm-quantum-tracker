from qiskit import IBMQ
import os
import requests as req
from datetime import datetime

ibm_token = ""
firebase_secret = ""

for k,v in os.environ.items():#key and value
    if k =="IBM_TOKEN":
        ibm_token=v
    if k =="FIREBASE_SECRET":
        firebase_secret=v

if ibm_token=="":
    try:
        ibm_token,firebase_secret = open("token.txt","r").read().split("\n")[0:2]
    except:
        raise RuntimeError("You didn't set the token in the IBM_TOKEN environment variable or token.txt file")
    

if not IBMQ.stored_account():
    IBMQ.save_account(ibm_token)
IBMQ.load_account()

provider = IBMQ.get_provider(group='open', project='main')

now = str(datetime.now())
yearmonth=now[0:7]
day=now[8:10]
hour=now[11:13]

for backend in provider.backends():
    name=backend.name()
    url = f'https://ibmq-statistics-default-rtdb.firebaseio.com/{name}/{yearmonth}/{day}/{hour}.json?auth={firebase_secret}'
    r=req.put(url,data=str(backend.status().pending_jobs))
    print(r.text)