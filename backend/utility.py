#This file contains all the agent functionalities

#Importing all the necessaries
import template
import os
import variables
import random
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain_openai import OpenAI
from langchain.chains.combine_documents.stuff import create_stuff_documents_chain
from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import FAISS

#setting upt the API keys
os.environ['OPENAI_API_KEY'] = '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'
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "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"

#Setting up the model
model = ChatOpenAI(model="gpt-4o-mini")
llm = OpenAI()
embeddings = OpenAIEmbeddings()

# A function to generate random numbers. This helps in generating different responses providing the same meaning to randomize the response lines.
def gen_random(i,j):
    random_number = random.randint(i,j)-1
    return random_number

#Function used to communicate with the model.
def ask_gpt(System_Message, Human_Message):
    messages = [
        SystemMessage(System_Message),
        HumanMessage(Human_Message),
    ]
    return model.invoke(messages).content

#Function to greet the user
def greeter():
    from datetime import datetime
    time = datetime.now().hour  # Get the current hour in 24-hour format
    if 5 <= time < 12:
        greetings = 'Good Morning'
    elif 12 <= time < 18:
        greetings = 'Good Afternoon'
    elif 18 <= time <= 23:
        greetings = 'Good Evening'
    else:
        greetings = 'Hard Worker'
    return greetings

#Function to update the user choice of providing information. As of now as the model is only generated for conversation based inputs, it is returning 0.
def update_user_choice():
    return 0

#Function to record the responses of the user related to project in a text document store at the backend
def record_response(response):
    with open(variables.project_file,'a', encoding='utf-8') as f:
        f.write(response+'\n')

#Function to spit the text in the text document where responses related to project is stored
def text_splitter():
    raw_text=''
    with open(variables.project_file, 'r') as f:
        for i in f.readlines():
            raw_text+=i
        raw_text = raw_text.replace('. ', '.\n')
    splitter = CharacterTextSplitter(
        separator = '\n',
        chunk_size = 800,
        chunk_overlap = 200,
        length_function = len
    )
    texts = splitter.split_text(raw_text)
    return texts

#This is requirement loop. This loop runs until the user confirms his response to all the fields mentioned in the template
def requirement_loop():
    print("Analyzing 🧐.....")
    end_convo = 0 #A flag to set when user ends conversation before providing all the requirements
    sections = list(template.template.keys()) #All the fields of the template

    #The prompt set up for the model
    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template="Given the following context:\n{context}\nAnswer the question:\n{question}",
    )

    #Using the chain
    chain = create_stuff_documents_chain(llm=llm, prompt=prompt)

    #The loop begins
    for i in sections:
        if end_convo == 1:
            break
        for j in template.template[i]:
            texts = text_splitter()
            document_search = FAISS.from_texts(texts, embeddings)

            #Analyzes whether the required information is present in the previously provided details
            query = f"If the text contains {j} with a meaning or sentiment or similar words or any information regarding it, then respond with 'yes.' Otherwise, respond with 'no,' ensuring the sentiment and context of the text are accurately analyzed."
            docs = document_search.similarity_search(query)

            result = chain.invoke({"context": docs, "question": query})

            if isinstance(result, str):
                processed_result = result.strip().lower()
            else:
                raise TypeError(f"Unexpected output format: {type(result)}")
            if processed_result == 'no':
                ran_number = gen_random(1,len(variables.question_lines_1))
                request = f"{variables.question_lines_1[ran_number]}{i}{variables.question_lines_2[ran_number]}{j}?"
                print(request)
                response = input()
                print('--------------------------------------------------------------')
                variables.request_response.update({request: response})

                #Sentiment analysis of the user
                sys_msg = f'''
                Analyze the given input and determine the appropriate response based on whether it directly answers {j}:
                If the input does not provide any information related to {j} or lacks relevance, respond with 'no'.
                If the input explicitly provides a valid answer to {j} (including direct or specific responses like dates, names, or values), respond with 'yes'.
                If the input provides sufficient information to indicate completeness or requests further actions (e.g., generating content based on the provided information), respond with 'end requirement'.
                Carefully analyze whether the input explicitly or implicitly answers {j}. Avoid overlooking direct, concise answers such as dates or specific terms."
                '''
                #Agent responses with proper messages
                variables.user_responses.append(ask_gpt(sys_msg, response))
                if variables.user_responses[-1].strip().lower() == 'no':
                    print('Okay. No issues')
                    print('Analyzing further 🧐.....')
                    record_response(f'No responses on the {i}------{j}')
                elif variables.user_responses[-1].strip().lower() == 'yes':
                    print("Analyzing 🧐.....")
                    record_response(f"{j}: {response}")
                elif variables.user_responses[-1].strip().lower() == 'end requirement':
                    print('Sure. ')
                    generate_charter()
                    end_convo=1
                    break
    generate_charter()

#Function which generates the charter (Under development)
def generate_charter():
    print("Thank you for your time. Now, ease yourself into your seat\nThe charter is on the way📥☺️.........")