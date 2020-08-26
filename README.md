# Neural Moosic

Neural Moosic is a project that aims to generate functional backing tracks for input leads, and generate leads based on the user's parameters.

## Installation
These installation instructions are desgined for Linux systems; Windows instructions will be added at a later date.

### 0. Fork, Clone and Extract:
* Fork the repository, and in a terminal opened in a folder of your choosing, run:
```
	git clone [your_forked_repository_url]
```
* Extract the downloaded folder and navigate to inside the folder.
### 1. Python dependencies:

* Set up a virtual environment. Run ```sudo apt install python3-venv``` if you do not have venv in your system.

```
	python3 -m venv [yourVenv]
```

* Activate your virtual environment.
```
	source [yourVenv]/bin/activate
```
* Use the package manager [pip](https://pip.pypa.io/en/stable/) to install the Python3 requirements for the project, as shown:

```
	pip install -r requirements.txt
```

### 2. Node.js dependencies:

* Use the package manager [npm](https://www.npmjs.com/get-npm) to install the Node.js requirements for the project. Run ```sudo apt install nodejs``` if you do not have Node.js in your system, and ```sudo apt install npm``` if you do not have npm in your system.
```
	cd frontend
	npm install
```

### 3. MongoDB:

* Install MongoDB and perform the applicable set-up steps. Make sure you have a /data/db folder in order for MongoDB to work. Set up the required permissions and, if required, specify the path for Mongo.

### 4. External dependencies:
* This project requires [Audacity](https://www.audacityteam.org/) to run successfully; To install, paste the following set of commands into your terminal:
```
	sudo add-apt-repository ppa:ubuntuhandbook1/audacity
	sudo apt-get update
	sudo apt-get install audacity
```
* Specifically, the [vamp](https://docs.google.com/forms/d/e/1FAIpQLScAWn0xrRgSsMIacBZEv2sFnqnlHBDVe1bSxnrMB6E6lV_ykw/viewform) plugin is also required. Follow [this guide](https://www.upf.edu/web/mtg/melodia) to install the vamp plugin.
## Usage

Fire up three terminals in the root folder. In the first one, run:

```
	sudo mongod
```

In the second one, run:

```
	cd backend 
	flask run --no-debugger
```

In the third one, run:

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

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.