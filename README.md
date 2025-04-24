### Install K6 if not exist in your system (Linux)

```
sudo apt update
sudo apt install -y gnupg software-properties-common
curl -s https://dl.k6.io/key.gpg | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/k6.gpg
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt update
sudo apt install k6
```

### Update Environment

- BASE_URL = Set the backend application URL.
- TOKEN = Set the user api token (Note: Login from the frontend application and take the token from local stroage)

### Run the script

```
k6 run v01.js
```