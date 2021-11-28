# logWatch
A simple node.js script to log all requests/updates to a discord channel.

## How To Install

To launch the project locally, you'll need [Node.js](https://nodejs.org/en/) installed on your machine. Once you do, follow these steps:

1. Clone the Github Repository:
    ```
    git clone https://github.com/dsnsgithub/logWatch
    ```
2. Enter repository and install dependencies:
    ```
    cd logWatch
    npm install
    ```
4. Create a `.env` file with these properties:
    ```
    TOKEN = [put discord bot id found at https://discord.com/developers/applications]
	CHANNEL_ID = [put discord channel id where you want logs]
	USER_MENTION_ID = [put discord id here]
	FOLDER = [put folder where ~/logs/server.log can be found]
    ```
5. Start the script:
    ```
    node .
    ```