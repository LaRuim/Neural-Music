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

3. Install requirements
```
	pip3 install -r requirements.txt
```

Fire up two terminals. In the first one, do: (make sure you're in your virtual environment for this command)

```
	cd backend 
	flask run --no-debugger
```

In the second one, do:

```
	cd frontend
	yarn start
```