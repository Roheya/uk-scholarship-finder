# ScholarFind – UK Scholarship Finder

## 1. Project Overview

ScholarFind is a web-based scholarship discovery application designed to help Gambian students find scholarship opportunities in the United Kingdom.

The application retrieves scholarship information from an external REST API and presents it in a simple, accessible interface. Users can browse available opportunities, search listings and filter results to find relevant scholarships.

## 2. Project Objectives

- Improve access to UK scholarship information for Gambian students.
- Demonstrate the integration of an external REST API.
- Present scholarship information in an organised format.
- Provide search and filtering functionality.
- Demonstrate web server deployment and load balancing.

## 3. Features

- Retrieves scholarship information from an external API.
- Displays scholarship opportunities for Gambian students.
- Provides scholarship search and filtering.
- Handles API request errors.
- Uses locally stored JSON data as a fallback when the API is unavailable.
- Provides a responsive user interface.

## 4. API Integration

ScholarFind uses the WorqNow Education API to retrieve UK scholarship information.

**API Provider:** [WorqNow](https://worqnow.ai/)

**API Documentation:** [WorqNow API Documentation](https://api.worqnow.ai/docs)

**API Endpoint:**

```text
https://api.worqnow.ai/education/uk/scholarships?country=GM&limit=20
```

| Parameter | Value |
|---|---|
| HTTP Method | GET |
| Country | GM (The Gambia) |
| Results Limit | 20 |
| Response Format | JSON |

JavaScript's Fetch API sends requests to the endpoint and processes the returned scholarship data. A local JSON file is included as fallback data when the external API request fails or returns an invalid response.

### Local JSON Fallback

The fallback file is located at:

`data/scholarships.json`

It contains locally stored scholarship information. When the API cannot provide valid data, the application attempts to load the locally stored information instead.

## 5. Technologies Used

- **HTML5:** Application structure.
- **CSS3:** Styling and responsive layout.
- **JavaScript:** API integration, search, filtering and user interaction.
- **REST API:** External scholarship data.
- **JSON:** Scholarship data storage.
- **NGINX:** Web server.
- **HAProxy:** Load balancing.
- **Git and GitHub:** Version control and repository hosting.

## 6. Project Structure

```text
uk-scholarship-finder/
│
├── index.html
├── style.css
├── script.js
├── data/
│   └── scholarships.json
├── codevibe-reports/
├── .gitignore
└── README.md
```

## 7. Running the Application Locally

### Prerequisites

- Git
- Python 3 or Visual Studio Code with Live Server
- A modern web browser

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Roheya/uk-scholarship-finder.git
```

**2. Navigate to the project directory**

```bash
cd uk-scholarship-finder
```

**3. Start a local development server**

```bash
python3 -m http.server 8000
```

If port 8000 is already in use, use port 8001 instead:

```bash
python3 -m http.server 8001
```

Alternatively, you can use the Live Server extension in Visual Studio Code.

**4. Open the application**

Visit the corresponding address in your browser:

- Port 8000: `http://localhost:8000`
- Port 8001: `http://localhost:8001`

## 8. Deployment on Web01 and Web02

The application was deployed on both provided web servers using NGINX.

The following steps were completed on each server:

1. Connected through SSH.
2. Cloned the GitHub repository.
3. Backed up the existing NGINX web directory.
4. Copied the application files into `/var/www/html/`.
5. Created the `data` directory and copied `scholarships.json`.
6. Set the required file permissions.
7. Validated the NGINX configuration.
8. Updated the deployed `script.js` with the latest application code.

### Deployment Verification

Both servers were tested using:

```bash
sudo nginx -t
curl -I http://localhost
```

Both returned `HTTP/1.1 200 OK`.

The `X-Served-By` response header confirmed the individual servers:

- Web01: `7413-web-01`
- Web02: `7413-web-02`

The local JSON fallback file was also tested on both servers:

```bash
curl -I http://localhost/data/scholarships.json
```

Both returned `HTTP/1.1 200 OK`, confirming that NGINX could serve the scholarship JSON file.

## 9. Load Balancer Configuration

HAProxy was already installed and running on the provided LB01 server. Its existing configuration was verified.

The configuration supports:

- HTTP on port 80.
- HTTPS on port 443.
- HTTP-to-HTTPS redirection.
- Round-robin load balancing.
- Backend health checks.

The backend configuration is:

```haproxy
backend web_backend
    balance roundrobin
    server web-01 web-01:80 check
    server web-02 web-02:80 check
```

The round-robin algorithm distributes incoming requests between Web01 and Web02 in rotation.

## 10. Load Balancer Testing

### Backend Connectivity

Both backend servers were tested from LB01:

```bash
curl -I http://web-01
curl -I http://web-02
```

Both returned successful HTTP responses.

### HAProxy Configuration Validation

```bash
sudo haproxy -c -f /etc/haproxy/haproxy.cfg
```

Result:

```text
Configuration file is valid
```

### Round-Robin Verification

The following command was used to send six requests through HAProxy:

```bash
for i in {1..6}; do
    curl -skI https://localhost | grep -i X-Served-By
done
```

The response headers alternated between Web01 and Web02, confirming successful request distribution.

### Application Access Through the Load Balancer

**Application URL:** [https://18.171.245.99](https://18.171.245.99)

The load balancer was tested using its public IP address. HTTPS routing and backend request distribution were verified.

The browser-level display of scholarship listings and the search and filtering functionality still require final verification on the deployed application.

**SSL Certificate Note:** The existing SSL certificate was issued for `www.beroheyatouray.tech`, rather than the load balancer's public IP address. Therefore, accessing the application through its IP address produces a browser certificate-name mismatch warning. HTTPS routing was successfully tested.

## 11. Challenges and Solutions

| Challenge | Solution |
|---|---|
| External API availability | Included local JSON fallback data. |
| API request limits | Implemented fallback loading when API requests fail. |
| Deployment on multiple servers | Deployed and tested the application independently on Web01 and Web02. |
| Keeping deployed files updated | Copied the updated JavaScript file to both web servers. |
| Load balancing verification | Used HAProxy tests and response headers to confirm traffic distribution. |
| SSL certificate mismatch | Documented the mismatch between the existing certificate domain and the load balancer IP. |
| Scholarship listings not displaying in the deployed browser | Verified that both servers could serve the JSON fallback file; further browser-side troubleshooting is required. |

## 12. API Attribution

ScholarFind uses the WorqNow Education API as its external source of scholarship information.

- **Provider:** [WorqNow](https://worqnow.ai/)
- **Documentation:** [WorqNow API Documentation](https://api.worqnow.ai/docs)
- **Endpoint:** `https://api.worqnow.ai/education/uk/scholarships?country=GM&limit=20`

**API Usage Limit:** The API allows up to 10 requests per day without an API key. Registering for a free API key increases the limit to 100 requests per day. Availability is subject to the provider's usage limits.

## 13. Project Repository

The complete source code is available on GitHub:

[ScholarFind – UK Scholarship Finder](https://github.com/Roheya/uk-scholarship-finder)

## 14. Conclusion

ScholarFind demonstrates how an external REST API can be integrated into a web application to improve access to scholarship information for Gambian students.

The project also demonstrates practical infrastructure skills through deployment on two NGINX web servers and the configuration and testing of HAProxy for load balancing.

### Git Contribution Note

<<<<<<< HEAD
Both contributor names displayed on this repository are mine. I used different Git identities during development, which is why GitHub displays them as two contributors. I completed this project independently.
=======
Both contributor names displayed on this repository are mine. I used different Git identities during development, which is why GitHub displays them as two contributors. I completed this project independently.
>>>>>>> 52d4a01 (Update README and scholarship functionality)
