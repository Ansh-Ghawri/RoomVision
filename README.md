# 🛌RoomVision: Interior Design Assistant🛌

### Deployment🚀

This project is deployed on **Render**. Visit the **live** site at:
https://roomvision-an-interior-design-assistant.onrender.com

## About the Project🌟

RoomVision is an innovative interior design assistant that leverages AI to analyze room images and provide personalized design suggestions. Built with a modern tech stack, this project allows users to upload images of their rooms, detect furniture, extract dominant colors, and receive recommendations for complementary decor items. The application integrates with the Hugging Face API for object detection and uses Sharp for color analysis, making it a powerful tool for interior design enthusiasts and professionals alike.

### Features✨
- **Image Upload**: Drag and drop or browse to upload room images.
- **AI-Powered Analysis**: Detects furniture (e.g., sofa, chair, bed) using the Hugging Face DETR model.
- **Color Extraction**: Identifies dominant colors and generates complementary, analogous, and triadic color palettes.
- **Design Suggestions**: Provides tailored recommendations based on detected objects and color schemes.
- **Responsive UI**: Built with React and styled with Tailwind CSS for a sleek, user-friendly interface.

### Tech Stack🚀
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Image Processing**: Sharp
- **AI Integration**: Hugging Face API
- **Deployment**: Render

## How to Use🌟

### Prerequisites
- **Node.js**: Ensure Node.js (version 14.x or later) is installed. Download it from [nodejs.org](https://nodejs.org/).
- **Git**: Install Git to clone the repository. Get it from [git-scm.com](https://git-scm.com/).
- **Hugging Face API Token**: You’ll need an API token from Hugging Face to use the object detection feature. Sign up at [huggingface.co](https://huggingface.co/) and generate a token.

### Installation

1. **Clone the Repository**
   - Open a terminal and run:
     ```bash
     git clone https://github.com/your-username/interior-design-assistant.git
     cd interior-design-assistant

2. **Install Dependencies**
   - Navigate to both the frontend and interior-design-backend directories and install 
     the required packages:
     ```bash
     cd frontend
     npm install
     cd ../interior-design-backend
     npm install

3. **Set Up Environment Variables**
   - Create a .env file(put it in .gitignore too) in the interior-design-backend directory.
   - Add your Hugging Face API token:
     ```bash
     HF_API_TOKEN=your_hf_api_token_here
4. **Build the Frontend**
   - Build the frontend assets:
     ```bash
     cd frontend
     npm run build

5. - Copy the dist folder to the backend:
     ```bash
     cp -r dist ../interior-design-backend/

6. **Run the Application**
   - Start the backend server:
     ```bash
     cd ../interior-design-backend
     npm start

7. - In a separate terminal, start the frontend development server:
     ```bash
     cd frontend
     npm run dev

Open your browser and go to http://localhost:5173 to use the app.

### Usage

1. Upload Images: Drag and drop room images (JPG or PNG, max 5MB) into the upload area or click to browse.
2. View Suggestions: Once processed, the app will display detected objects, color palettes, and design recommendations.
3. Clear Uploads: Use the "Clear Uploads" button to reset the interface.

## Contribution✨

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure you follow the existing code style and add tests where applicable.

### Contact

For questions or support, contact **ghawri.ansh@gmail.com** or open an issue on the GitHub repository.