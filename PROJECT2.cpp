#include <iostream>  
#include <iomanip> 
#include <vector>
#include <ctime> //chatbot
#include <sstream> //search functionality
#include <cstdlib> 
#include <unordered_map> //chat bot
#include <algorithm>
#include <thread> //reminder
#include <chrono> //reminder
#include <string> 

using namespace std;

// Chatbot Class
class Chatbot 
{
    string botName;
    vector<string> toDoList;
    // Basic dictionary
    unordered_map<string, string> dictionary; 

public:

    Chatbot(string name = "ChatBot") 
    {
        botName = name;

        // Predefined dictionary
        dictionary["hello"] = "A greeting or expression of goodwill.";
        dictionary["programming"] = "The process of designing and building executable computer software to accomplish a specific task.";
        dictionary["motivation"] = "The reason or reasons one has for acting or behaving in a particular way.";
        dictionary["ai"] = "Technology that enables machines to mimic human intelligence.";
        dictionary["blockchain"] = "A decentralized and secure digital ledger technology.";
        dictionary["cybersecurity"] = "Protecting systems and data from cyber threats.";
        dictionary["cloudcomputing"] = "Using remote servers for data storage and computing power.";
        dictionary["encryption"] = "Converting data into a secure, unreadable format.";
        dictionary["ml"] = "A subset of AI that enables systems to learn from data.";
        dictionary["metaverse"] = "A virtual universe combining augmented and virtual reality.";
    }

    // Change chatbot name
    void changeName() 
    {
        cout << "Enter a new name for me: ";
        cin >> botName;
        cout << "Great! My new name is " << botName << "!" << endl;
    }

    // Get Current Date & Time
    void getCurrentDateTime() 
    {
        time_t now = time(0);
        char* dt = ctime(&now);
        cout << "Current Date & Time: " << dt;
    }

    // Greetings & Small Talk
    void greetUser() {
        string userInput;
        cout << botName << ": Hello! How can I assist you today? Type 'hi' or 'hello' to start a conversation: ";
        cin.ignore();  // Clear the input buffer
        getline(cin, userInput);

        vector<string> greetings = {
            "Hi there! How can I help you today?",
            "Hello! How can I assist you today?",
            "Hey! What can I do for you today?"
        };

        if (userInput == "hi" || userInput == "hello") 
        {
            srand(time(0));
            cout << botName << ": " << greetings[rand() % greetings.size()] << endl;
        } 
        else if (userInput == "how are you") 
        {
            cout << botName << ": I'm doing great, thank you for asking! How about you?\n";
        } else {
            cout << botName << ": Hey! What would you like to do?\n";
        }
    }

    // Calculator Function
    void calculator() 
    {
        double num1, num2;
        char op;
        cout << "Enter first number: ";
        cin >> num1;
        cout << "Enter operation (+, -, *, /): ";
        cin >> op;
        cout << "Enter second number: ";
        cin >> num2;

        double result;
        switch (op) {
            case '+': result = num1 + num2; break;
            case '-': result = num1 - num2; break;
            case '*': result = num1 * num2; break;
            case '/':
                if (num2 != 0) result = num1 / num2;
                else { cout << "Error! Division by zero.\n"; return; }
                break;
            default: cout << "Invalid operation!\n"; return;
        }
        cout << "Result: " << result << endl;
    }

    
    // Dictionary function
    void dictionaryLookup() 
    {
        string word;
        cout << "Enter a word to look up(programming,motivation,metaverse,encryption,cybersecurity,ai,ml,cloudcomputing,blockchain,):";
        cin >> word;
        transform(word.begin(), word.end(), word.begin(), ::tolower); // Make it case-insensitive

        if (dictionary.find(word) != dictionary.end()) 
        {
            cout << word << ": " << dictionary[word] << endl;
        } 
        else 
        {
            cout << "Sorry, I don't know that word.\n";
        }
    }
};


// Reminder Class (Encapsulation)
class Reminder 
{
    public:
        string message;
        time_t reminderTime;
    
        Reminder(string msg, int secondsFromNow) 
        {
            message = msg;
            reminderTime = time(0) + secondsFromNow;
        }
    };
    
class ReminderSystem 
    {

        vector<Reminder> reminders;
    
    public:
        void addReminder(string msg, int secondsFromNow) 
        {
            reminders.push_back(Reminder(msg, secondsFromNow));
            cout << "Reminder added successfully!\n";
        }
    
        void showReminders() 
        {
            if (reminders.empty()) 
            {
                cout << "No reminders set.\n";
                return;
            }
            cout << "\nUpcoming Reminders:\n";
            for (const auto &reminder : reminders) 
            {
                cout << reminder.message << " at " << ctime(&reminder.reminderTime);
            }
        }
    
        void checkReminders() {
            while (true) {
                time_t now = time(0);
                for (auto it = reminders.begin(); it != reminders.end(); ) {
                    if (it->reminderTime <= now) 
                    {
                        cout << "\nReminder Alert: " << it->message << "\n";
                        it = reminders.erase(it);  // Remove triggered reminder
                    } 
                    else 
                    {
                        ++it;
                    }
                }
                this_thread::sleep_for(chrono::seconds(1)); // Check every second
            }
        }
    };




class Task {
    string description;
    bool complete;
public:
   Task(string desc) 
   {
        description = desc;
        complete = false;
    }

   string getdescription()
    {
        return description;
    }
    bool iscomplete()
    {
        return complete;
    }

    void markcomplete()
    {
        complete = true;
    }
};

class ToDoList 
{
    vector<Task> tasks;

public:
    void viewTasks() 
    {
        if (tasks.empty()) 
        {
            cout << "No tasks to do." << endl;
        } 
        else 
        {
            cout << "To-Do List:" << endl;
            for (size_t i = 0; i < tasks.size(); i++) 
            {
                cout << i + 1 << " - " << (tasks[i].iscomplete() ? "[completed] " : "[pending] ") << tasks[i].getdescription() << endl;
            }
        }
    }

    void addTask() 
    {
        string taskDesc;
        cout << "Enter the task: " << endl;
        cin.ignore();
        getline(cin, taskDesc);
        tasks.push_back(Task(taskDesc));
        cout << "Task added successfully!" << endl;
    }

    void deleteTask() 
    {
        int taskNum;
        viewTasks();
        cout << "Enter task number to delete: " << endl;
        cin >> taskNum;

        if (taskNum < 1 || taskNum > int(tasks.size())) 
        {
            cout << "Invalid task number." << endl;
        } 
        else 
        {
            tasks.erase(tasks.begin() + taskNum - 1);  
            cout << "Task deleted successfully!" << endl;
        }
    }

    void completeTask() {
        int taskNum;
        viewTasks();
        cout << "Enter task number to mark as complete: " << endl;
        cin >> taskNum;

        if (taskNum < 1 || taskNum > int(tasks.size())) 
        {
            cout << "Invalid task number." << endl;
        } 
        else 
        {
            tasks[taskNum - 1].markcomplete();
            cout << "Task marked as complete!" << endl;
        }
    }
};

class WebSearch {

        string formatQuery(const string& query) 
        {
            stringstream ss;
            for (char ch : query) 
            {
                ss << (ch == ' ' ? '+' : ch); // Replace spaces with '+'
            }
            return ss.str();
        }
    public:
        void searchOnline(const string& query) 
        {
            string formattedQuery = formatQuery(query);
            string searchURL = "start https://www.google.com/search?q=" + formattedQuery; // "start" works for Windows
    
            system(searchURL.c_str()); // Open the browser
        }
    
 };

int main() 
{
    Chatbot chatbot;
    ReminderSystem reminderSystem;
    ToDoList myList;
    WebSearch assistant;
    string query;
    thread reminderThread(&ReminderSystem::checkReminders, &reminderSystem);
    chatbot.greetUser();
    int choice,subchoice;

    while (true) 
    {
        cout << "1.TO USE CHATBOT\n";
        cout << "2.TO DO LIST\n";
        cout << "3.SEARCH FUNCTIONALITY\n";
        cout << "4.TO SET REMINDER\n";
        cout << "5.TO EXIT\n";

        cout << "Enter your choice:\n";
        cin >> choice;

        switch (choice) 
        {
            case 1:{
                do{
                cout << "\nChoose an option:\n";
                cout << "11. Get Current Date & Time\n";
                cout << "12. Greetings & Small Talk\n";
                cout << "13. Calculator\n";
                cout << "14. Dictionary\n";
                cout << "15. To change chatbot name\n";

                cout << "Enter your subchoice:\n";
                cin >> subchoice;

                switch (subchoice)
                {
                    case 11: chatbot.getCurrentDateTime(); break;
                    case 12: chatbot.greetUser(); break;
                    case 13: chatbot.calculator(); break;
                    case 14: chatbot.dictionaryLookup(); break;
                    case 15: chatbot.changeName(); break;
                    default: cout << "Invalid choice!" << endl;
                }
            }while((subchoice >= 11) && (subchoice <= 15));
            break;
        } 

        case 4:
        {
            do
            {
                cout << "\nReminder System Menu:\n";
                cout << "1. Add Reminder\n";
                cout << "2. Show Reminders\n";
                //cout << "3. Exit\n";

                cout << "Enter choice: ";
                cin >> choice;
                switch(choice){
                case 1:
                {
                    string msg;
                    int timeInSeconds;
                    cin.ignore();
                    cout << "Enter reminder message: ";
                    getline(cin, msg);
                    cout << "Enter time in seconds from now: ";
                    cin >> timeInSeconds;
                    reminderSystem.addReminder(msg, timeInSeconds);
                    break;
                } 
                case 2:
                {
                    reminderSystem.showReminders();
                    break;
                } 

                default:
                cout<<"invalid choice!!";
            }
                 
                }while(choice !=3);
                reminderThread.join();
                break;
            }
                

      case 2:
      {
       do
        {
        cout << "\nPress:\n";
        cout << "1. To Add Task\n";
        cout << "2. To View Tasks\n";
        cout << "3. To Mark Task as Complete\n";
        cout << "4. To Delete Task\n";

        cout << "Enter your subchoice: ";
        cin >> subchoice;

        switch (subchoice) 
        {
            case 1: myList.addTask(); break;
            case 2: myList.viewTasks(); break;
            case 3: myList.completeTask(); break;
            case 4: myList.deleteTask(); break;
            default: cout << "Invalid choice!" << endl;
        }
      }while ((subchoice >= 1) && (subchoice <= 4));
      break;
      
    }
    case 3:
    {
        cin.ignore();
        cout << "Enter search query: \n";
        getline(cin,query);

        assistant.searchOnline(query);
    }

    case 5: cout << "Goodbye! Have a great day!\n"; 

    default: cout << "Invalid choice! Try again.\n";

         } 
      }
        return 0;
    }
