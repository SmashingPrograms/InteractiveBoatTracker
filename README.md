# Pier 11 Marina Interactive Map v2.0

## Overview

A professional-grade interactive boat management system for marina operations. This application provides visual mapping, comprehensive boat tracking, and real-time updates for marina staff and administrators.

## Business Context

Pier 11 Marina is a family-owned boat storage and service facility in Chicago, operating since 1983. This system replaces manual paper-based tracking with a visual, searchable, real-time boat management interface that handles 200+ boats across 6 acres.

## Key Features

- **Interactive Visual Map**: Drag-and-drop boat positioning on actual marina layout
- **Comprehensive Boat Management**: Full CRUD operations with search and filtering
- **Multi-Map Architecture**: Support for multiple marina properties (Pier 11, Paoli Storage)
- **Real-time Updates**: Automatic synchronization between map and data
- **Responsive Design**: Professional UI with collapsible sidebar
- **Role-based Authentication**: Admin and staff access levels
- **Comprehensive Testing**: Unit, integration, and E2E test coverage

## Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM with PostgreSQL database
- **Pydantic**: Data validation and serialization
- **JWT**: Authentication and authorization
- **Pytest**: Testing framework
- **Alembic**: Database migrations

### Frontend
- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety throughout
- **React Konva**: Interactive canvas for map manipulation
- **TanStack Query**: Server state management
- **Zustand**: Client state management
- **Vitest**: Unit testing framework
- **Testing Library**: Component testing
- **Playwright**: End-to-end testing

## Project Structure

```
pier11-marina-v2/
├── README.md
├── docker-compose.yml
├── .env.example
├── .gitignore
├── 
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   ├── security.py
│   │   │   └── exceptions.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── map.py
│   │   │   ├── boat_listing.py
│   │   │   └── boat_position.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── map.py
│   │   │   ├── boat_listing.py
│   │   │   └── boat_position.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── deps.py
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── auth.py
│   │   │       ├── maps.py
│   │   │       ├── boats.py
│   │   │       └── positions.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── boat.py
│   │   │   └── map.py
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── logger.py
│   │       └── validators.py
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   ├── test_models/
│   │   ├── test_api/
│   │   ├── test_services/
│   │   └── test_utils/
│   ├── alembic/
│   │   ├── versions/
│   │   └── alembic.ini
│   ├── requirements.txt
│   ├── Dockerfile
│   └── pytest.ini
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   │       └── maps/
│   │           └── pier11_marina.jpg
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── ConfirmDialog.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   └── ErrorBoundary.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── map/
│   │   │   │   ├── MapCanvas.tsx
│   │   │   │   ├── BoatObject.tsx
│   │   │   │   ├── MapControls.tsx
│   │   │   │   └── MapToolbar.tsx
│   │   │   ├── boat/
│   │   │   │   ├── BoatList.tsx
│   │   │   │   ├── BoatCard.tsx
│   │   │   │   ├── BoatForm.tsx
│   │   │   │   ├── BoatSearch.tsx
│   │   │   │   └── BoatDetails.tsx
│   │   │   └── auth/
│   │   │       ├── LoginForm.tsx
│   │   │       └── ProtectedRoute.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useBoats.ts
│   │   │   ├── useMaps.ts
│   │   │   └── useDebounce.ts
│   │   ├── stores/
│   │   │   ├── authStore.ts
│   │   │   ├── mapStore.ts
│   │   │   └── uiStore.ts
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── boats.ts
│   │   │   └── maps.ts
│   │   ├── types/
│   │   │   ├── api.ts
│   │   │   ├── boat.ts
│   │   │   ├── map.ts
│   │   │   └── user.ts
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── storage.ts
│   │   └── styles/
│   │       ├── globals.css
│   │       ├── components.css
│   │       └── utilities.css
│   ├── tests/
│   │   ├── setup.ts
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── e2e/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── vitest.config.ts
│   ├── playwright.config.ts
│   └── Dockerfile
│
└── docs/
    ├── api.md
    ├── deployment.md
    ├── development.md
    └── user-guide.md
```

## Database Schema

### Maps
- Support for multiple marina properties
- Image upload and management
- Active/inactive status

### Boat Listings
- Complete boat information (size, make, model, customer, etc.)
- Proper foreign key relationships
- Index-based tracking system

### Boat Positions
- Canvas coordinates and dimensions
- Visual properties (color, rotation)
- Relationship to specific maps

### Users & Authentication
- Role-based access (admin, staff)
- JWT-based authentication
- Session management

## Development Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- Docker & Docker Compose

### Database Setup

1. **Install PostgreSQL** (if not already installed):
   ```bash
   brew install postgresql@14
   brew services start postgresql@14
   ```

2. **Create Database User and Database**:
   ```bash
   # Connect to PostgreSQL
   psql postgres
   
   # Inside PostgreSQL prompt, create user and database:
   CREATE USER pier11 WITH PASSWORD 'password';
   CREATE DATABASE pier11_marina OWNER pier11;
   GRANT ALL PRIVILEGES ON DATABASE pier11_marina TO pier11;
   
   # Exit PostgreSQL
   \q
   ```

3. **Verify Connection**:
   ```bash
   psql -U pier11 -d pier11_marina -h localhost
   ```

### Quick Start
```bash
# Clone repository
git clone <repository-url>
cd pier11-marina-v2

# Start with Docker Compose
docker-compose up -d

# Or manual setup:

# Backend setup
cd backend
pip install -r requirements.txt

# Initialize Alembic (if not already done)
alembic init alembic

# Edit alembic.ini to set database URL:
# sqlalchemy.url = postgresql://pier11:password@localhost/pier11_marina

# Create and apply migrations
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload

# Frontend setup (in new terminal)
cd frontend
npm install
npm run dev
```

### Environment Variables
Copy `.env.example` to `.env` and configure:
```env
DATABASE_URL=postgresql://pier11:password@localhost/pier11_marina
SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=30
```

### Troubleshooting Database Issues

**PostgreSQL won't start:**
```bash
# Check service status
brew services list | grep postgresql

# Restart PostgreSQL
brew services stop postgresql@14
brew services start postgresql@14

# Check logs
tail -f /usr/local/var/log/postgresql@14.log
```

**Role/Database doesn't exist:**
```bash
# Recreate user and database
psql postgres
CREATE USER pier11 WITH PASSWORD 'password';
CREATE DATABASE pier11_marina OWNER pier11;
GRANT ALL PRIVILEGES ON DATABASE pier11_marina TO pier11;
```

**Connection refused:**
- Ensure PostgreSQL is running: `brew services start postgresql@14`
- Check if something else is using port 5432: `lsof -i :5432`

## Testing

### Backend Testing
```bash
cd backend
pytest --cov=app --cov-report=html
```

### Frontend Testing
```bash
cd frontend
npm run test:unit          # Vitest unit tests
npm run test:integration   # Testing Library
npm run test:e2e           # Playwright E2E
```

## API Documentation

FastAPI provides automatic API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Key Improvements from v1

### Architecture
- ✅ Proper database relationships with foreign keys
- ✅ Multi-map support architecture
- ✅ Separation of concerns (services, models, schemas)
- ✅ Type safety throughout with TypeScript

### User Experience
- ✅ Responsive design with collapsible sidebar
- ✅ Professional UI components
- ✅ Real-time updates without page refresh
- ✅ Comprehensive error handling and user feedback

### Code Quality
- ✅ Senior-level code organization
- ✅ Comprehensive test coverage
- ✅ Proper error handling and logging
- ✅ Code documentation and type hints

### Performance
- ✅ Optimized database queries
- ✅ Efficient state management
- ✅ Canvas rendering optimizations
- ✅ Lazy loading and pagination

## Deployment

### Production Deployment
```bash
# Build containers
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Environment-specific Configuration
- Development: Local SQLite/PostgreSQL
- Staging: Cloud database with test data
- Production: Full PostgreSQL with backups

## Contributing

### Code Standards
- Follow TypeScript/Python type hints
- Write tests for all new features
- Use conventional commit messages
- Maintain test coverage above 90%

### Pull Request Process
1. Create feature branch from `main`
2. Write comprehensive tests
3. Ensure all tests pass
4. Update documentation
5. Request code review

## License

Proprietary - Pier 11 Marina

## Support

For technical issues or feature requests:
- Create GitHub issue
- Contact development team
- Check documentation in `/docs`

---

## Next Phase: v3.0 Features

Planned for future releases:
- Dynamic scale component
- Advanced boat analytics
- Customer portal access
- Mobile app companion
- Integration with marina POS systems
- Automated reporting and insights