# 🧞‍♂️ Aladdin Global B2B 
### Verified Wholesale Marketplace & Direct Factory Sourcing Platform

**Aladdin Global B2B** is a next-generation wholesale ecosystem designed to connect verified global buyers directly with factory-vetted manufacturers across Bangladesh. This platform simplifies bulk trade, ensuring transparent pricing, secure logistics, and scalable growth for SMEs and large-scale enterprises.

---

## 🚀 Key Modules & Role-Based Ecosystem

The platform is architected around a complex, permission-driven access control system tailored for a professional corporate environment.

### 👑 Super Admin Dashboard
The command center of the platform. Features include:
- **Finance & Payouts:** Complete revenue tracking, admin commissions, and automated vendor withdrawal management.
- **Role & Staff Management:** Ability to create managers with **Granular Permissions** (Checkbox-based access).
- **Vendor/Seller Management:** Direct vetting and store approval process.
- **Affiliate Management:** Integrated marketing system to track commissions and sales performance.
- **Media Library:** Centralized repository for high-performance asset management.
- **Advanced Reports:** Real-time business health monitoring using Recharts.

### 🏢 Vendor / Seller Center
- **Direct Sourcing Tool:** Advanced bulk pricing logic (Tiered MOQ pricing).
- **Order Management:** Lifecycle tracking from Pending to Delivered.
- **Wholesale Cataloging:** Managing massive inventories with easy updates.

### 💰 Smart Affiliate Program
- **Marketing Analytics:** Link generators, conversion statistics, and commission logs.
- **Earnings Tracking:** Transparent payouts via wallet integration.

### 👤 Verified Buyer Portal
- **Corporate Sourcing:** Bulk inquiry management and secure B2B Escrow payments.

---

## 🛠 Tech Stack

**Aladdin Global B2B** utilizes the "PENS" stack—Modern, Reliable, and Scalable.

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 15+](https://nextjs.org/) (App Router, React) |
| **Backend** | [Express.js](https://expressjs.com/) (Node.js) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **State Mgmt**| [Zustand](https://zustand-demo.pmnd.rs/) |
| **Authentication**| [Supabase Auth](https://supabase.com/auth) / JWT |

---

## 📂 Project Structure (Industry Standard)

```text
aladdin-b2b/
├── backend/                # Server-side architecture
│   ├── prisma/             # DB Models & Migrations
│   ├── src/
│   │   ├── controllers/    # Request handlers (Business Logic)
│   │   ├── middlewares/    # Auth, Roles & Permission guards
│   │   ├── routes/         # Endpoints mapping
│   │   └── services/       # Prisma query logic
├── frontend/               # Client-side Next.js App
│   ├── src/
│   │   ├── app/            # App Router (Next.js 15)
│   │   ├── components/     # Atomic UI Design Components
│   │   ├── hooks/          # Shared react-query logic
│   │   ├── store/          # Zustand global states
│   │   └── lib/            # Axios instance & Shared config
