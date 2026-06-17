# GoldenRif

## Getting Started

### Step 1 — Clone the Repository

```bash
git clone https://github.com/ElkasmiOussama/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME
```

---

### Step 2 — Setup the Backend (Laravel)

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
```

Then open `.env` and set your database:

```env
DB_DATABASE=your_database_name
DB_USERNAME=root
DB_PASSWORD=
APP_URL=http://localhost:8000
```

Then run:

```bash
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

---

### Step 3 — Setup the Frontend (React)

Open a second terminal, then:

```bash
cd frontend
npm install
npm run dev
```
