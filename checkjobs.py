from qiskit import IBMQ
import os

ibm_token = ""

for k,v in os.environ.items():
    if k =="IBM_TOKEN":
        ibm_token=v

if ibm_token=="":
    try:
        ibm_token = open("token.txt","r").read()
    except:
        raise RuntimeError("You didn't set the token in the IBM_TOKEN environment variable or token.txt file")
    


IBMQ.save_account(ibm_token)

IBMQ.load_account()

provider = IBMQ.get_provider(group='open', project='main')
backend = provider.get_backend('ibmq_vigo')
print(backend.status().pending_jobs)