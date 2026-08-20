# Nestly - Room and Property Rental Web Application

## Project Purpose
Nestly is a web application built to address a real-world problem faced by many families and travelers. Often, guardians of students visiting colleges, families visiting patients in hospitals, or people traveling for temporary work need stays that last for a few days to a few weeks. 

Standard hotel bookings are expensive for such durations, and searching for local rooms or rental options manually consumes valuable time and frequently leads to pricing disputes. Nestly helps users find proper room stays and affordable rentals directly from property owners, without wasting time or dealing with pricing conflicts.

## Features
- User registration and login for both guests and property owners.
- Add, edit, and delete property listings with image uploads and amenities choices.
- Filter properties by Rent (monthly stays) or Booking (daily stays).
- Sending booking requests and rental inquiries.
- Owner dashboard to accept or reject incoming booking requests.
- User dashboard to track active, pending, accepted, or rejected booking requests with cancellation options.
- Review and rating system for guests who have completed their stays.

## Tech Stack
- Frontend: HTML, CSS, Bootstrap, EJS (Embedded JavaScript templates)
- Backend: Node.js, Express.js
- Database: MongoDB (using Mongoose ODM)
- Authentication: Passport.js

## Local Setup Instructions

1. Clone the repository:
   git clone https://github.com/Rishaubkumar/nestly.git
   cd nestly

2. Install the dependencies:
   npm install

3. Set up the environment variables:
   Create a .env file in the root folder with the following variables:
   CLOUD_NAME=your_cloudinary_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   ATLASDB_URL=your_mongodb_atlas_connection_string
   SECRET=your_session_secret_key

4. Run the application:
   node app.js
   
   The server will start listening on port 8080. Open http://localhost:8080 in your browser.

## Acknowledgment
We would like to express our sincere gratitude and thanks to Dr. Anand Motwani, under whose valuable guidance and mentorship we have successfully built this project.
