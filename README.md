# Arab Therapy Task

A simple HTML/CSS/JS project with Tailwind CSS integration for development purposes.

## Prerequisites

Make sure you have Node.js installed on your system.

## Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Development Server

To start the live development server:
```bash
npm start
```
This will launch live-server and automatically open your project in the browser with live reload functionality.

### Building CSS

To compile and watch Tailwind CSS changes:
```bash
npm run build:css
```
This command will:
- Watch for changes in `./assets/css/core.css`
- Compile Tailwind CSS
- Output minified CSS to `./assets/css/build.min.css`
- Continue watching for changes

## Note

The `assets/css/core.css` file is intended for development `for your review` use only and contains Tailwind CSS directives. The compiled output `build.min.css` should be referenced in your HTML files.