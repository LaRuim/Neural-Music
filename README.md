# Running:
1. Set up a virtual environment
```
	python3 -m venv myVenv
```
Run ```sudo apt-get install python3-venv``` if you do not have venv in your system.

2. Activate your virtual environment
```
	source myVenv/bin/activate
```

3. Make sure you have MongoDB installed on your system. Set up the required permissions and, if required, specify the path for Mongo.

4. Install Python requirements
```
	pip3 install -r requirements.txt
```

Fire up three terminals. In the first one, do:

```
	sudo mongod
```

In the second one, do:

```
	cd backend 
	flask run --no-debugger
```

In the third one, do:

```
	cd frontend
	npm start
```

For convenience, three bash scripts are included; this will run all three of the above in the same terminal, making it harder to debug but easier to start. To use it, open the script in question (restart.sh is recommended), modify the Virtual Environment path, and run it after giving the required permissions.

```
	sudo chmod +rx start.sh
	sudo chmod +rx stop.sh
	sudo chmod +rx restart.sh
	./restart.sh
```