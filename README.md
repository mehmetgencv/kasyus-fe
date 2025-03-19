# Kasyus - E-Commerce Frontend

![Kasyus Logo](public/images/kasyus.svg)

Welcome to **Kasyus**, a modern e-commerce frontend application built with **Next.js**. This project provides a seamless online shopping experience, including features like product browsing, cart management, and user authentication.

Developed by **Mehmet Genç**, this repository contains the frontend codebase for the Kasyus platform.

## **📸 Screenshots**
Here are some previews of the **Kasyus** e-commerce frontend:

### 🏠 **Homepage**
This is the main landing page where users can browse featured products and categories.

<p align="center">
  <img src="/public/images/app-images/homepage.png" width="500">
</p>

---

### 👤 **Profile Details & Shopping Cart**
On the left, users can manage their **profile details**, such as addresses and payment methods.  
On the right, the **shopping cart** allows users to review and manage their selected products.

<p align="center">
  <img src="/public/images/app-images/profile-details.png" width="400">
  <img src="/public/images/app-images/cart.png" width="400">
</p>

---
## 🚀 GitHub Repositories
- **Frontend:** [https://github.com/mehmetgencv/kasyus-fe](https://github.com/mehmetgencv/kasyus-fe)
- **Backend (Spring Boot):** [https://github.com/mehmetgencv/kasyus](https://github.com/mehmetgencv/kasyus)

---

## 📌 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## ✨ Features
✅ Responsive product listing and detail pages.  
✅ Shopping cart functionality with add-to-cart options.  
✅ User authentication system.  
✅ Dynamic pages for About, Contact, Terms, and Privacy.  
✅ Custom 404 error page for better user experience.  
✅ Modular and reusable components (e.g., Footer, ImageSlider).  
✅ Integration with an API gateway for product and cart data.

---

## 🛠 Tech Stack
- **Frontend Framework**: Next.js (App Router)
- **Backend**: Spring Boot
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Dependencies**: React, react-slick, next/image
- **API**: Custom API Gateway (e.g., `http://localhost:8072`)
- **Other**: TypeScript for type safety

---

## 🏗 Installation
### **Prerequisites**
Ensure you have the following installed:
- **Node.js** (v18.x or later)
- **npm** or **yarn**
- **Git**

### **Steps**
1. **Clone the frontend repository:**
   ```sh
   git clone https://github.com/mehmetgencv/kasyus-fe.git
   cd kasyus-fe
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
    - Create a `.env.local` file in the root directory.
    - Add the following variable (replace with your API URL):
      ```sh
      NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8072
      ```

4. **Run the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser and visit:**
    - [http://localhost:3000](http://localhost:3000)

---

README dosyana **Docker Compose ile çalıştırma** adımını ekleyelim. Aşağıdaki güncellenmiş README içeriğini kullanabilirsin.

---

## **🏗 Installation & Running with Docker Compose**
### **Prerequisites**
Ensure you have the following installed:
- **Docker** (latest version)
- **Docker Compose** (included in Docker Desktop)
- **Git**

### **Steps**
1. **Clone the frontend repository:**
   ```sh
   git clone https://github.com/mehmetgencv/kasyus-fe.git
   cd kasyus-fe
   ```

2. **Run the application with Docker Compose:**
   ```sh
   docker compose up -d --build
   ```

3. **Open your browser and visit:**
   - [http://localhost:3000](http://localhost:3000)

4. **Stopping the container:**
   ```sh
   docker compose down
   ```

---


## 🎮 Usage
- Navigate to `/products` to browse available products.
- View product details on `/products/[id]`.
- Access static pages like `/about`, `/contact`, `/terms`, and `/privacy`.
- Use the cart functionality to add and manage items.
- A custom 404 page will appear for invalid routes.

---

## 📂 Project Structure
```
kasyus-fe/
  ├── app/                  # Next.js App Router pages
  │   ├── about/            # About page
  │   ├── contact/          # Contact page
  │   ├── terms/            # Terms page
  │   ├── privacy/          # Privacy page
  │   ├── not-found.tsx     # Custom 404 page
  ├── components/           # Reusable components
  │   ├── Footer.tsx        # Footer component
  │   ├── ImageSlider.tsx   # Image slider component
  │   ├── ProductInfo.tsx   # Product info component
  ├── public/               # Static assets
  │   ├── images/           # Images (e.g., kasyus.svg, empty_image_2.jpg)
  ├── types/                # TypeScript type definitions
  ├── utils/                # Utility functions
  ├── README.md             # This file
  ├── next.config.js        # Next.js configuration
  ├── package.json          # Project dependencies and scripts
  ├── tsconfig.json         # TypeScript configuration
```

---

## 🤝 Contributing
Contributions are welcome! To contribute:
1. **Fork the repository**.
2. **Create a new branch**:
   ```sh
   git checkout -b feature/your-feature
   ```
3. **Make your changes and commit**:
   ```sh
   git commit -m "Add your feature"
   ```
4. **Push to the branch**:
   ```sh
   git push origin feature/your-feature
   ```
5. **Open a Pull Request**.

**Note:** Please ensure your code adheres to the existing style and includes appropriate tests.

---

## 📜 License
This project is currently **unlicensed**. For usage permissions, please contact the developer.

---

## 📩 Contact
👨‍💻 **Developer**: Mehmet Genç  
🌐 **Website**: [mehmetgenc.net](https://www.mehmetgenc.net)  
📂 **GitHub**: [@mehmetgencv](https://github.com/mehmetgencv)

For questions or support, reach out via the [Contact Page](https://www.mehmetgenc.net) or email.

---

Thank you for checking out Kasyus! 🚀 Happy coding! 🎉

