# Development Guide

This guide covers the development setup for the CooWriter AI WordPress plugin.

## Prerequisites

- Node.js (version 22.13.1)
- npm (comes with Node.js)
- WordPress environment (Local, XAMPP, etc.)

## Setup

### 1. Clone Repository

First, clone the repository to your local WordPress plugins directory:

```bash
cd wp-content/plugins/
git clone https://github.com/CooWriter-AI/CooWriter-AI-Plugin.git
```

### 2. Install Dependencies

Navigate to the plugin directory and install the required dependencies:

```bash
cd coowriter-ai
npm install
```

### 3. Development Setup

Before starting development, ensure `SCRIPT_DEBUG` is set to true in your `wp-config.php` file:

```php
define( 'SCRIPT_DEBUG', true );
```

### 4. Development Commands

#### Start Development Server
For development with hot reloading:

```bash
npm run start
```

This will start the development server with webpack hot reloading enabled.

#### Build for Production
To build the project for production:

```bash
npm run build
```

This creates optimized, minified files in the build directory.

