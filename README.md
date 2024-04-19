# Scala Sentiment Web

Scala Sentiment Web is a React-based frontend for sentiment analysis, designed to interface with our sentiment analysis [backend service](https://github.com/LelouchCcCC/sentiment-analysis). This project utilizes the ChatGPT API to analyze and interpret the sentiment of the text input by users.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js and npm](https://nodejs.org/en/download/) (Node.js 14.x or later is recommended)

## Getting Started

Follow these steps to get your development environment set up:
### 1. Clone the repository


```bash
git clone git@github.com:Celestialfoxx/scala-sentiment-web.git
cd scala-sentiment-web
```
### 2. Install dependencies

Run the following command to install the necessary dependencies:
```bash
npm install
```

### 3. Set up the environment variables
Create a .env file in the root directory of the project and add the following environment variable:

```bash
REACT_APP_API_KEY=<your_chatgpt_api_key_here>
# Replace <your_chatgpt_api_key_here> with your actual ChatGPT API key.
```

### 4. Start the development server
```bash
npm start
# This command will start the server and open up a browser window with the application running.
```




## Backend Connection

This project is designed to work with a sentiment analysis backend. You can find the [backend repository](https://github.com/LelouchCcCC/sentiment-analysis) and set it up using the instructions provided at backend repo readme docmuent

## Contributing
We welcome contributions to Scala Sentiment Web. Please feel free to fork the repository, make changes, and submit pull requests.

## Author
Yuhan Zhang
Yuxuan Qin
Zhihan Zheng