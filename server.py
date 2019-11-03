from flask import Flask
import datetime
import threading
import math

# Determine OS Version
import os
sys = os.name
if sys == "posix":
	import idleMac
elif sys == "Windows":
	import idleWin

# Set up database
import pyrebase
config = {
	"apiKey": "AIzaSyCqaNjasQj8J5au9-CZrRKudSSr3fQtJfo",
	"authDomain": "sleepwatch-d401a.firebaseapp.com",
	"databaseURL": "https://sleepwatch-d401a.firebaseio.com",
	"projectId": "sleepwatch-d401a",
	"storageBucket": "sleepwatch-d401a.appspot.com",
	"messagingSenderId": "809313268199",
	"appId": "1:809313268199:web:4c9a01f31f8b3aa9dd0d42",
	"measurementId": "G-XE8ZPZGWHP"
}
firebase = pyrebase.initialize_app(config)

# Authentication
auth = firebase.auth()

while(True):
	username = input("Enter Username: ").lower()
	password = input("Enter Password: ")
	try:
		user = auth.sign_in_with_email_and_password(username + "@sleepwatch.com", password)
	except:
		print("Incorrect Password")
	else:
		break

db = firebase.database()

violated = False

info = db.child(username).get().val()
startTime = info.get("startTime")
endTime = info.get("endTime")
data = {
	username: {
		"startTime": startTime,
		"endTime": endTime,
		"timeLeft": 0,
		"streaks": 1
	}
}
db.set(data)

def sanitize(num):
	if len(str(num)) == 1:
		return "0" + str(num)
	else:
		return str(num)

def timerThread():
	#newTime = time.time()
	threading.Timer(5, timerThread).start()
	currentTime = str(datetime.datetime.now().time())
	currentHour, currentMin = int(currentTime[0:2]), int(currentTime[3:5])
	info = db.child(username).get().val()
	startTime = info.get("startTime")
	endTime = info.get("endTime")
	startHour, startMin = int(startTime[0:2]), int(startTime[3:5])
	endHour, endMin = int(endTime[0:2]), int(endTime[3:5])
	streaks = info.get("streaks")
	if checkStatus():
		minLeft = (startHour * 60 + startMin) - (currentHour * 60 + currentMin)
		hourLeft = int(math.floor(minLeft / 60))
		minLeft = minLeft - (hourLeft * 60)
		data = {
			username: {
				"startTime": startTime,
				"endTime": endTime,
				"timeLeft": sanitize(hourLeft) + ":" + sanitize(minLeft),
				"streaks": streaks
			}
		}
		db.set(data)
	else:
		data = {
			username: {
				"startTime": startTime,
				"endTime": endTime,
				"timeLeft": 0,
				"streaks": 0
			}
		}
		db.set(data)

def checkStatus():
	if idleMac.getPowerState():
		info = db.child(username).get().val()
		startTime = info.get("startTime")
		endTime = info.get("endTime")
		startHour, startMin = int(startTime[0:2]), int(startTime[3:5])
		endHour, endMin = int(endTime[0:2]), int(endTime[3:5])
		streaks = info.get("streaks")
		print("Monitor State: On")
		currentTime = str(datetime.datetime.now().time())
		currentHour, currentMin = int(currentTime[0:2]), int(currentTime[3:5])
		if startHour > endHour:
			if currentHour >= startHour or currentHour <= endHour:
				if currentHour == startHour:
					if currentMin > startMin:
						return False
					else:
						return True
				elif currentHour == endHour:
					if currentMin < endMin:
						return False
					else:
						return True
				else:
					return False
			else:
				return True
		else:
			if currentHour >= startHour and currentHour <= endHour:
				if currentHour == startHour:
					if currentMin > startMin:
						return False
					else:
						return True
				elif currentHour == endHour:
					if currentMin < endMin:
						return False
					else:
						return True
				else:
					return False
			else:
				return True
	else:
		print("Monitor State: Off")
		return True

timerThread()



'''app = Flask(__name__)

@app.route('/')
def mainPage():
	return "Hello"
def updatePage():
	return "TBD"
'''