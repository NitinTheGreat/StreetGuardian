# StreetGuardian

StreetGuardian is a community-driven platform designed to connect individuals experiencing homelessness with the support they need. By enabling citizens to easily report sightings and administrators to coordinate responses, we aim to create a faster, more effective path to shelter and safety.

Our mission is to ensure no one is left without a safe place to stay, bridging the gap between public awareness and administrative action.

---

## 🌟 What It Does

-   **Citizen Reporting:** Anyone can submit a report with the location, a photo, and notes about an unsheltered individual, pinpointed on an interactive map.
-   **Admin Dashboard:** A centralized hub for government administrators to view, manage, and act on incoming reports and SOS alerts in real-time.
-   **Interactive Map:** Provides a bird's-eye view of all reported cases and emergency hotspots, helping to visualize needs and dispatch resources efficiently.
-   **SOS Emergency Alerts:** A critical feature for immediate, high-priority alerts when an individual is in urgent need of help.
-   **Community Rewards:** To encourage participation, users earn points for their reports which can be redeemed for rewards.
-   **Secure & Private:** Uses JWT-based authentication to protect the privacy and data of both our users and the individuals being assisted.

---

## 📸 Screenshots

*Replace the placeholder links with actual screenshots of your application.*

| Landing Page                                     | Reporting Form                                 | Login Page                                     |
| ------------------------------------------------ | ---------------------------------------------- | ---------------------------------------------- |
| ![Landing Page](https://ibb.co/CKnrtmk6) | ![Reporting Form](https://ibb.co/C5LGnTpL) | ![Login Page](https://ibb.co/B5H7k9wZ) |

| Admin Dashboard                                  | Rewards Page                                     |
| ------------------------------------------------ | ------------------------------------------------ |
| ![Admin Dashboard](https://ibb.co/2B2myVt) | ![Rewards Page](https://ibb.co/PGNXHpPq) |

| SOS Alert Page                                   |
| ------------------------------------------------ |
| ![SOS Alert Page](https://ibb.co/cfmccCW) |

---

## 🛠️ Tech Stack

-   **Frontend:** Next.js, React, Tailwind CSS, Framer Motion
-   **Backend:** Node.js (Next.js API Routes)
-   **Database:** MongoDB
-   **Mapping:** Leaflet & React-Leaflet
-   **Authentication:** JSON Web Tokens (JWT)
-   **Deployment:** Microsoft Azure

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js (v18.x or later) and a package manager (npm, yarn, or pnpm) installed.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/StreetGuardian2.0.git
    cd StreetGuardian2.0
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following, replacing the placeholder values:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

The application should now be running on [http://localhost:3000](http://localhost:3000).

---

## 📂 Project Structure

The project follows a standard Next.js `app` directory structure.

```
StreetGuardian2.0/
├── app/
│   ├── api/                # API routes for backend logic
│   │   ├── report/
│   │   └── sos/
│   ├── admindash/          # Admin dashboard page
│   ├── report/             # User report submission page
│   ├── rewards/            # Rewards page
│   ├── sos/                # SOS alert page
│   ├── (auth)/             # Route group for auth pages
│   │   ├── login/
│   │   └── register/
│   ├── layout.tsx          # Root layout
│   └── page.jsx            # Landing page
├── components/             # Shared React components (Navbar, Map, etc.)
├── context/                # React context providers (e.g., AuthContext)
├── lib/                    # Utility functions and libraries
├── public/                 # Static assets
└── reports/                # CSV reports generated from submissions
```
---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## ✍️ Meet the Developers

This project was brought to life by:

-   **Nitin Kumar Pandey** - [LinkedIn](https://linkedin.com/in/nitinkrpandey)
-   **Mahin Dhoke** - [LinkedIn](https://linkedin.com/in/mahindhoke)