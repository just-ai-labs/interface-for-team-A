
from flask import Flask, request, jsonify
# from application import main
# from application import template
# from application import utility
# from application import variables
from flask_cors import CORS
import os
from openai import OpenAI
os.environ['OPENAI_API_KEY'] = 'sk-ijklmnopqrstuvwxijklmnopqrstuvwxijklmnop'

client = OpenAI(
        api_key=os.environ.get("OPENAI_API_KEY"),  # This is the default and can be omitted
    )
app = Flask(__name__)# flask application

CORS(app)# to enable cross origin resource sharing
@app.route('/chat', methods=['POST'])# api to handle chat features
def chat_with_bot():
    # Get user input from the request
    data = request.json
    user_input = data.get("message",'')
    if not user_input:
        return jsonify({"error": "Message is required"}), 400#handling empty post requests


    # chat_completion = client.chat.completions.create(
    #     messages=[
    #         {
    #             "role": "user",
    #             "content": "Say this is a test",
    #         }
    #     ],
    #     model="gpt-4o",
    # )
    # response_content = chat_completion['choices'][0]['message']['content']
    #
    # # Return the response as JSON
    # return jsonify({"response": response_content}) #returns response from openai was done for testing the api only

    # chat_response= agent_response(user_input)# provides input to the agent function
    # return jsonify(reply=chat_response)returns a json of the response from the agent
    return jsonify(message="dummy_response")#return a dummy response for now.


if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True, port=8000)

# The agent is now running on a command line to get the response from the agent  to have a function that would
#accept the data from the api endpoint namely /chat and a function to return the response from the agent
# the api will created now respond to post requests of user which has body of json containing the prompts and returns
#returns the responses to the prompts from the model.
#Since the model is not yet ready for deployment i used flask to serve the api and can be easily converted to a express api
#when the model is fully ready


#Author:Darshan K