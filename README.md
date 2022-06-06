# Chat-nearby 

The idea with this React application is to use socket.io to create a real time chat application with a catch: you connect with a stranger that is within a certain radius of you. At the moment, it is set by default to 15m, but the idea is that when there is enough user the radius can be expanded. This app is partly inspired from the (in)famous chatting website Omegle where you anonymously connect  with someone from anywhere in the world. I originally wanted to make this project for [Reveal 2022](https://www.linkedin.com/feed/update/urn:li:activity:6935284206390423553/) competition but I couldn't meet the deadline. So, anyway, about technologies: 

* **

## Front-end
* **Framework**: React
* **Styling**: CSS & Material UI 
* **State Management**: Zustand
* **Routing**: React router DOM library 
* **
## Backend:
* Node JS
* Socket IO (Websocket library)
* MongoDB 
* **
## How it works?
As user enter the webpage, a socket connection is created and the socket ID is stored in the database. When user enters chat, the webpage will ask for location data permission. The app only tracks the latitude and longitude of the user from location and sends it to backend where the user is then either kept waiting if there is no other available user nearby (within set radius) or connected to another waiting socket within set radius distance. Upon disconnecting the user socket ID and location data is removed from database. 

It is probably not the best implementation of this idea, but I guess it works for an idea I had on an extremely boring tram ride home from work which I've managed to put together in about a week using a library I've never used before. Props to the amazing documentation of socket.io and Zustand.  
* **
## Improvement:
In no particular order: 
* TypeScript :)  
* Testing 
* Formatting code 
* CI/CD
* React Native version? :D 
* User database and authentication 
* **
### Live deployment: https://aqueous-tor-35882.herokuapp.com/
