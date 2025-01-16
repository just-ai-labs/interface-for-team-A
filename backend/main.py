#This is the main file to initiate the Agent
#Importing the requirements
import utility #All the functionalities
import variables #All the variables
complete = 0 #A flag, sets when the conversation completes

#The first approach made to start the conversation
request = f"Hi {utility.greeter()} <USER>, welcome to agent 1. I can help you with creating project charter and flowcharts."
print(request)
response = input()
variables.request_response.update({request: response})

#Sentiment analysis of the user
sys_msg = '''
    If the input expresses a greeting, such as "Hi," "Hello," or has a similar meaning, assign the context as greeting.
If the input is an inquiry, such as "How are you?" or any expression asking about someone's well-being, assign the context as enquiry.
If the input requests help related to starting a project or has a similar meaning, assign the context as project.
If the input is anything else than the mentioned above, then assign the context as none.
If the input fits into more than one category, concatenate the respective contexts
    '''
variables.user_responses.append (utility.ask_gpt(sys_msg, response))
print('--------------------------------------------------------------')

#A loop which converse with the user until he asks regarding a project
while response:
    if variables.user_responses[variables.k] == 'greeting':
        request = 'How can I help you?'
        print('How can I help you?')
    elif variables.user_responses[variables.k] == 'greeting, enquiry' or variables.user_responses[variables.k] == 'enquiry':
        request = "I'm doing great, Thank you. How can I help you?"
        print("I'm doing great, Thank you. How can I help you?")
    elif variables.user_responses[variables.k] == 'greeting, enquiry, project' or variables.user_responses[variables.k] == 'enquiry, project':
        request = "I'm doing great, Thank you. Let's start the project. I can help you with creating project charter and flowcharts.\nHow do you want to provide the details?"
        print("I'm doing great, Thank you. Let's start the project. How do you want to provide the details?")
        break
    elif variables.user_responses[variables.k] == 'project' or variables.user_responses[variables.k] == 'greeting, project':
        request = "Let's start the project. I can help you with creating project charter and flowcharts.\nHow do you want to provide the details?"
        print("Let's start the project. How do you want to provide the details?")
        break
    else:
        request = 'I can only help with the project charter and flowchart generation'
        print('I can only help with the project charter and flowchart generation')
    response = input()
    print('--------------------------------------------------------------')
    variables.request_response.update({request: response})
    variables.user_responses.append(utility.ask_gpt(sys_msg, response))
    variables.k+=1

#Gets the user choice of providing information.
user_choice = utility.update_user_choice()

#Further responses of agent based on the user choice of providing information.
if user_choice == 0:
    request = "Great choice. Kindly write the details here"
    print("Great choice. Kindly write the details here")
    response = input()
    print('--------------------------------------------------------------')
    variables.request_response.update({request: response})
    utility.record_response(response)

utility.requirement_loop()