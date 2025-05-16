# RealReview Backend – Setup & Deployment (Branch: `backend-setup`)

This is the backend service for **RealReview**, a real estate platform that allows users to upload property images with metadata such as location, timestamp, user, and rating. This branch focuses on backend setup, PostgreSQL integration, and server deployment to AWS EC2.

---

## 🚀 Features

- Upload an image with metadata (`location`, `submitted_by`, `timestamp`, `rating`)
- View all uploaded images along with metadata
- Delete an uploaded image
- Store image files on server and metadata in PostgreSQL
- API deployed and running on AWS EC2 (HTTP, port 80)

## Usage
- Uploading Image: POST - "/api/images"
- Viewing image list: GET - "/api/images"
