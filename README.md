# IBM Quantum Computer Usage Tracker
![project screenshot](https://user-images.githubusercontent.com/48658337/125024219-31e65800-e035-11eb-90e5-8e3aafd29090.jpg)
<br>[Demo Link](https://ibmq-statistics.web.app/)
## Description
  This is a web app that uses Firebase and D3JS to display data about the usage over time of IBM's quantum computers. It collects the data with a Python script I have running periodically on my own server with a cron job and stores it in Firebase. 
    
  The python script for updating the database is tested on python 3.8.5 and 3.8.6. If the build wheel for psutils fails on Linux see this: https://stackoverflow.com/questions/21530577/fatal-error-python-h-no-such-file-or-directory.
