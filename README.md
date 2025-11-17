🏦 Demo Bank for BookBound – Setup Guide
========================================

This repository contains the **Bank Backend** and **Bank Frontend** used by the BookBound project.

To run this system correctly, you must first set up the main BookBound project (frontend + backend), then run this Bank system (backend + frontend).

✅ 1. Setup BookBound Project (Required First)
=============================================

Before running the Bank system, install:

### 📘 **BookBound Frontend**

👉 [https://github.com/RAISA-MUKARRAMA/BookBound\_ebook\_reader](https://github.com/RAISA-MUKARRAMA/BookBound_ebook_reader)

### 🖥️ **BookBound Backend**

👉 [https://github.com/RAISA-MUKARRAMA/BookBound\_ebook\_reader\_backend](https://github.com/RAISA-MUKARRAMA/BookBound_ebook_reader_backend)

🏦 2. Setup Bank Backend
========================

📥 Clone the Backend
--------------------

```bash
git clone https://github.com/RAISA-MUKARRAMA/Demo_Bank_for_BookBound.git
cd Demo_Bank_for_BookBound/bank-backend
```

⚙️ Create .env File
-------------------

Create a file named **.env** in the bank-backend folder and paste the following:

```bash
 MONGO_URL = mongodb+srv://raisa123:raisa123@raisa123.tykn3bx.mongodb.net/
 DB_NAME = bankDB
 PORT = 6002
 FRONTEND_URL = http://localhost:7002
 BOOKBOUND_SERVER_URL = http://localhost:5002
 ```

☑️ **No need to create your own database.The MongoDB cluster is provided for testing purposes.**

▶️ Run the Bank Backend
-----------------------

```bash
npm install  npm start
```

The backend will run on:

👉 [**http://localhost:6002**](http://localhost:6002)

💳 3. Setup Bank Frontend
=========================

📥 Clone the Frontend
---------------------

Inside the same project folder:

```bash
cd ../bankforbookbound
```

⚙️ Create .env.local
--------------------

Create a file named **.env.local** and paste:

```bash
NEXT_PUBLIC_API_URL=http://localhost:6002
```

▶️ Run the Bank Frontend
------------------------

```bash
npm install
npm run dev
```

The frontend will run on:

👉 [**http://localhost:7002**](http://localhost:7002)

🎯 Final Run Order (IMPORTANT)
==============================

Run all projects in this order:

- 1️⃣ **BookBound Backend** → [http://localhost:5002](http://localhost:5002)
- 2️⃣ **BookBound Frontend** → [http://localhost:3002](http://localhost:3002)
- 3️⃣ **Bank Backend** → [http://localhost:6002](http://localhost:6002)
- 4️⃣ **Bank Frontend** → [http://localhost:7002](http://localhost:7002)

🧪 Demo Bank Account (Ready to Use)
-----------------------------------

You can use this **demo account** already stored in the database:

*   **Account No:** 987654321
    
*   **PIN:** 123456
    

⚠️ **Do NOT use the account no: 123456789** — it is reserved for the BookBound website and should not be used for testing manually.

🎉 You're Ready to Use the Full BookBound + Bank System!
========================================================