# Patchcore Dataset Generator

This is a ReactJS user interface where the user can upload normal and defect sample videos, provide for prompts for segmentation and send to backend server for dataset generation as required by patchcore.

We need NodeJS to run the project on a web browser. NodeJS can be installed for any machine as per instructions on this [website](https://nodejs.org/en/download/).

For stability and reliability, please install NodeJS v18(LTS) or v20(LTS).

After installing NodeJS, start the user interface in development mode by running inside the project root directory:
```bash
npm install # to install the required packages
npm start # to start the development server
```

This will start a development server on port 3000 (by default) on the local machine that can be accessed using this link: [http://localhost:3000](http://localhost:3000)

Since the backend server is expected to run on port 5000, same is used on line 195 of `src/components/VideoUploader.js` file. If the server is started on some other port, it can be changed here. After making the change, restarting the application is not necessary since React support hot reload.
