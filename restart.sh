sudo fuser -k 3000/tcp
sudo fuser -k 5000/tcp
sudo fuser -k 27017/tcp
source ~/../../env/Moosic/bin/activate
mongod & 
cd backend && flask run &
cd frontend && npm start
