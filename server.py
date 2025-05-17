import requests

base_url="http://20.244.56.144/evaluation-service"
endpoints = {"Prime Numbers" : f"{base_url}/primes", "Fibonacci Numbers" : f"{base_url}/fibo", "Even Numbers" : f"{base_url}/even", "Random Numbers" : f"{base_url}/rand"}

for name, url in endpoints.items():
    try:
        response=requests.get(url)
        if response.status_code == 200: numbers = response.json().get("numbers", [])
            print(f"{name}: {numbers}")
        else:
            print(f"Failed to fetch {name}.Status code:{response.status_code}")
    except Exceptation as e:
        print(f"Error fetching {name} : {str(e)}")
        
