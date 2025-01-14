# CarPrime

[![License](https://img.shields.io/github/license/Polyphemus980/CarPrime)](LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/Polyphemus980/CarPrime)](https://github.com/Polyphemus980/CarPrime/issues)
[![GitHub Forks](https://img.shields.io/github/forks/Polyphemus980/CarPrime)](https://github.com/Polyphemus980/CarPrime/network)
[![GitHub Stars](https://img.shields.io/github/stars/Polyphemus980/CarPrime)](https://github.com/Polyphemus980/CarPrime/stargazers)

## Table of Contents

- [Project Overview](#project-overview)
- [Demo](#demo)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Git Flow](#git-flow)
  - [Branch Types](#branch-types)
  - [Branch Naming Conventions](#branch-naming-conventions)
  - [Creating and Managing Branches](#creating-and-managing-branches)
  - [Workflow Steps](#workflow-steps)
  - [Additional Practices](#additional-practices)
- [Contributing](#contributing)
  - [Steps to Contribute](#steps-to-contribute)
  - [Code of Conduct](#code-of-conduct)
- [Issue Management](#issue-management)
  - [Creating Issues](#creating-issues)
  - [Issue Labels](#issue-labels)
- [Continuous Integration/Continuous Deployment (CI/CD)](#continuous-integrationcontinuous-deployment-cicd)
  - [GitHub Actions](#github-actions)
  - [Status Badges](#status-badges)
- [Project Tasks and Sprints](#project-tasks-and-sprints)
- [License](#license)
- [Contact](#contact)

## Project Overview

**CarPrime** is a cutting-edge car rental application designed to provide users with a seamless and intuitive experience in renting vehicles. The platform caters to both individual customers and businesses, offering a wide range of features to manage vehicle rentals efficiently.

### Key Objectives

- **User-Friendly Interface:** Deliver an intuitive and responsive frontend that enhances user experience across all devices.
- **Comprehensive Vehicle Management:** Allow users to browse, search, and filter a vast inventory of vehicles with detailed specifications.
- **Secure Booking and Payment:** Implement secure booking processes with integrated payment gateways to ensure safe transactions.
- **Administrative Controls:** Provide administrators with robust tools to manage vehicles, bookings, and user accounts effectively.
- **Scalability and Performance:** Ensure the application is scalable to handle a growing user base and maintain optimal performance.

## Demo

![CarPrime Demo](https://github.com/Polyphemus980/CarPrime/blob/master/docs/demo.gif?raw=true)

## Features

- **User Authentication:**
  - Registration and login functionalities.
  - Password reset and account recovery options.
- **Vehicle Browsing:**
  - Browse a wide range of vehicles with detailed information.
  - Advanced filtering and search capabilities.
- **Booking Management:**
  - Create, view, and cancel bookings with ease.
  - Real-time availability checks.
- **Payment Processing:**
  - Secure payment gateway integration (e.g., Stripe).
  - Support for multiple payment methods.
- **Admin Dashboard:**
  - Manage vehicle listings, bookings, and user accounts.
  - Generate reports and analytics.
- **Responsive Design:**
  - Optimized for desktops, tablets, and mobile devices.
- **Notifications:**
  - Email notifications for bookings, confirmations, and updates.
- **API Documentation:**
  - Comprehensive API docs using Swagger for easy integration and development.

## Technologies Used

- **Frontend:**
  - React.js
  - Redux for state management
  - Tailwind CSS for styling
- **Backend:**
  - .NET 6
  - Entity Framework Core for ORM
  - ASP.NET Core Web API
- **Database:**
  - SQL Server
- **Others:**
  - Git & GitHub for version control
  - Docker for containerization
  - Azure DevOps for CI/CD pipelines
  - Swagger for API documentation

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- [Git](https://git-scm.com/)
- [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
- [Node.js & npm](https://nodejs.org/)
- [Docker](https://www.docker.com/get-started) (optional, for containerization)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Polyphemus980/CarPrime.git
   cd CarPrime
   ```
2. **Clone the Repository**
     ```bash
    cd CarPrime
    dotnet restore
   ```

3. **Setup Frontend**
     ```bash
    cd CarPrime
    dotnet run

   ```

## Git Flow

We follow a structured Git Flow to ensure smooth development, collaboration, and deployment processes. Below is an overview of our branching strategy, naming conventions, and workflow.

### Branch Types

1. **Main (`main` or `master`)**
   - **Purpose:** Reflects the production-ready state.
   - **Access:** Protected; merges only via pull requests after code review.
   - **Deployments:** Automated deployments to production occur from this branch.

2. **Develop (`develop`)**
   - **Purpose:** Integration branch for features; represents the latest development state.
   - **Access:** Protected; requires pull requests for merging.
   - **Deployments:** Used for staging environment deployments.

3. **Feature Branches (`feature/*`)**
   - **Purpose:** Develop new features or enhancements.
   - **Base Branch:** `develop`
   - **Merge Back To:** `develop`

4. **Release Branches (`release/*`)**
   - **Purpose:** Prepare for a new production release.
   - **Base Branch:** `develop`
   - **Merge Back To:** `main` and `develop`

5. **Hotfix Branches (`hotfix/*`)**
   - **Purpose:** Quick fixes for critical issues in production.
   - **Base Branch:** `main`
   - **Merge Back To:** `main` and `develop`

### Branch Naming Conventions

Consistent branch naming is crucial for clarity and organization. Below are the conventions for each branch type:

1. **Main Branch**
   - **Name:** `main` or `master`

2. **Develop Branch**
   - **Name:** `develop`

3. **Feature Branches**
   - **Prefix:** `feature/`
   - **Format:** `feature/<short-description>`
   - **Example:** `feature/user-authentication`

4. **Release Branches**
   - **Prefix:** `release/`
   - **Format:** `release/v<major>.<minor>.<patch>`
   - **Example:** `release/v1.2.0`

5. **Hotfix Branches**
   - **Prefix:** `hotfix/`
   - **Format:** `hotfix/<short-description>`
   - **Example:** `hotfix/fix-login-bug`

### Creating and Managing Branches

Follow these steps to create and manage branches according to the Git Flow strategy.

#### 1. Creating a Feature Branch

Developing a new feature should start from the `develop` branch.

```bash
# Switch to the develop branch
git checkout develop

# Pull the latest changes
git pull origin develop

# Create a new feature branch
git checkout -b feature/<short-description>

```

#### 2. Creating a Release Branch

```bash
# Switch to the develop branch
git checkout develop

# Pull the latest changes
git pull origin develop

# Create a new release branch
git checkout -b release/v<major>.<minor>.<patch>

```

#### 3. Creating a Hotfix Branch
For critical issues in production, create a hotfix branch from main.  
```bash
# Switch to the main branch
git checkout main

# Pull the latest changes
git pull origin main

# Create a new hotfix branch
git checkout -b hotfix/<short-description>

```

### Workflow Steps

#### 1. Starting a new feature
```
git checkout develop
git pull origin develop
git checkout -b feature/awesome-feature
```

#### 2. Completing a Feature
```
git checkout develop
git pull origin develop
git checkout feature/awesome-feature
git rebase develop
git checkout develop
git merge feature/awesome-feature
git push origin develop
```

#### 3. Starting a Release
```
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0
```

#### 4. Completing a Release
```
git checkout main
git pull origin main
git merge release/v1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

git checkout develop
git merge release/v1.0.0
git push origin develop

```

#### 5. Starting a Hotfix
```
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug
```

#### 6. Completing a Hotfix
```
git checkout main
git merge hotfix/critical-bug
git tag -a v1.0.1 -m "Hotfix critical bug"
git push origin main --tags

git checkout develop
git merge hotfix/critical-bug
git push origin develop

```

### Getting Started

#### 1. Clone the Repository
```
git clone https://github.com/yourusername/car-rental-frontend.git
cd car-rental-frontend
```

#### 2. Install Dependencies
```
npm install
```

#### 3. Run the Application
```
npm start
```

### Contributing
We welcome contributions! Please follow the Git Flow outlined above to create feature branches, submit pull requests, and ensure your code adheres to our coding standards.

#### Steps to Contribute

##### 1. Fork the Repository
Click the Fork button at the top-right corner of the repository page to create your own copy.

##### 2. Clone Your Fork
```
git clone https://github.com/Polyphemus980/CarPrime.git
cd car-rental-frontend
```
##### 3. Set Up Upstream Remote
```
git remote add upstream https://github.com/Polyphemus980/CarPrime.git
```

##### 4. Create a New Branch
```
git checkout -b feature/your-feature-name
```

##### 5. Make Your Changes
```
git add .
git commit -m "Add user authentication feature"

```
##### 6. Push to Your Fork
```
git push origin feature/your-feature-name


```

##### 7. Create a Pull Request

##### 8. Address Feedback

##### 9. Merge Your Pull Request

### License 

Copyright (c) [2025] 
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


## Contact

For contact, please private message the creators through the official mail listed on the github account.