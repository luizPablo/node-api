## Requeriments

 - [Node JS](https://nodejs.org/en/)
 - Docker
	 - The database used, the Mongo, is easily installed on any computer through Docker. [Here](https://docs.docker.com/install/linux/docker-ce/ubuntu/) is the Docker installation guide.
 - This API works in conjunction with its corresponding [Client](https://github.com/luizPablo/react-app)

## First steps
- [Install Docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/). If you have MongoDB in your computer, skip this step, you just need to change the MongoDB url in the *index.js* file at the root directory.
- Since you have already installed docker on your computer, run the following commands
	- Download the image virtual machine with MongoDB:
		- `sudo docker pull mongo`
    
	- Create a container with MongoDB:
		- `sudo docker run --name mongodb -p 27017:27027 -d mongo`
    
	- When you restart or shutdown your computer, you need start the container again, just run the following command
		- `sudo docker start mongodb`
    
- Clone the repository on your computer	
- In the project directory, run the following commands
	- `npm install`
	- `npm start`
  
		- Runs the app in the development mode. The application run on address [http://localhost:5000](http://localhost:5000) from default. You can change this in the *index.js* file at the root directory. 
- If all goes well, something similar to the image below will appear on your terminal

![enter image description here](https://i.postimg.cc/jj1d5QwD/Screenshot-from-2018-12-04-23-34-48.png)
	 
- Now, your API is running, and you can use the [react-app](https://github.com/luizPablo/react-app) and all their functionalities.

## Functionalities (Routes)
- Register
- Authentication
- Get posts
- Filter posts
- Get users
- Filter users
- Like/unlike posts
- Follow/unfollow users
- CRUD users
- CRUD posts

## Development
- The application was build with [Node](https://nodejs.org/en/)
- All dependencies are at the file *package.json*
- Resources used
	- [GraphQL](https://graphql.org/)
	- [Node](https://nodejs.org/en/)
	- [MongoDB](https://www.mongodb.com/)
	- [Docker](https://docs.docker.com/)
