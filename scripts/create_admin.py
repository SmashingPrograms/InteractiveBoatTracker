#!/usr/bin/env python3
"""
Create initial admin user for Pier 11 Marina Interactive Map

This script creates the first admin user needed to bootstrap the authentication system.
Run this after setting up the database and running migrations.

Usage:
    python scripts/create_admin.py                    # Use default credentials
    python scripts/create_admin.py --interactive     # Custom credentials
    python scripts/create_admin.py --help           # Show help
"""

import sys
import os
import argparse
import getpass
from pathlib import Path

# Add backend to Python path
script_dir = Path(__file__).parent
backend_dir = script_dir.parent / "backend"
sys.path.insert(0, str(backend_dir))

try:
    from app.core.database import SessionLocal
    from app.models.user import User, UserRole
    from app.core.security import get_password_hash
    from app.services.auth import AuthService
except ImportError as e:
    print(f"Error importing backend modules: {e}")
    print("Make sure you're running this from the project root directory")
    print("and that you've installed the backend dependencies:")
    print("  cd backend && pip install -r requirements.txt")
    sys.exit(1)


def check_database_connection():
    """Test database connection before proceeding"""
    try:
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        print("\nMake sure:")
        print("1. PostgreSQL is running: brew services start postgresql@14")
        print("2. Database exists: createdb pier11_marina")
        print("3. User has access: GRANT ALL PRIVILEGES ON DATABASE pier11_marina TO pier11;")
        print("4. Migrations are applied: alembic upgrade head")
        return False


def validate_email(email):
    """Basic email validation"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password(password):
    """Password strength validation"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one number"
    if not any(c.islower() for c in password):
        return False, "Password must contain at least one lowercase letter"
    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter"
    return True, "Password is valid"


def create_admin_user(email, password, full_name, interactive=False):
    """Create admin user with given credentials"""
    
    if not check_database_connection():
        return False
    
    db = SessionLocal()
    try:
        # Check if any users exist
        user_count = db.query(User).count()
        if user_count > 0:
            existing_admin = db.query(User).filter(
                User.role == UserRole.ADMIN
            ).first()
            
            if existing_admin:
                print(f"Admin user already exists: {existing_admin.email}")
                if not interactive:
                    print("Use --interactive flag to create additional admin users")
                    return True
        
        # Check if this specific email exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            print(f"User with email {email} already exists")
            return False
        
        # Validate inputs
        if not validate_email(email):
            print(f"Invalid email format: {email}")
            return False
        
        is_valid, message = validate_password(password)
        if not is_valid:
            print(f"Password validation failed: {message}")
            return False
        
        # Create admin user
        admin_user = User(
            email=email,
            hashed_password=get_password_hash(password),
            full_name=full_name,
            role=UserRole.ADMIN,
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        
        print(f"✅ Admin user created successfully!")
        print(f"   Email: {email}")
        print(f"   Name: {full_name}")
        print(f"   Role: admin")
        print(f"\nYou can now:")
        print(f"1. Start the server: uvicorn app.main:app --reload")
        print(f"2. Visit API docs: http://localhost:8000/docs")
        print(f"3. Click 'Authorize' and login with these credentials")
        
        if password == "admin123":
            print(f"\n⚠️  SECURITY WARNING: Change the default password after first login!")
        
        return True
        
    except Exception as e:
        db.rollback()
        print(f"Error creating admin user: {e}")
        return False
    finally:
        db.close()


def interactive_setup():
    """Interactive admin user creation"""
    print("🔧 Interactive Admin User Setup")
    print("=" * 40)
    
    while True:
        email = input("Admin email: ").strip()
        if validate_email(email):
            break
        print("Invalid email format. Please try again.")
    
    full_name = input("Full name: ").strip()
    if not full_name:
        full_name = "Admin User"
    
    while True:
        password = getpass.getpass("Password: ")
        password_confirm = getpass.getpass("Confirm password: ")
        
        if password != password_confirm:
            print("Passwords don't match. Please try again.")
            continue
        
        is_valid, message = validate_password(password)
        if is_valid:
            break
        print(f"Password requirements not met: {message}")
    
    return create_admin_user(email, password, full_name, interactive=True)


def default_setup():
    """Create admin user with default credentials"""
    print("🔧 Creating default admin user...")
    print("=" * 40)
    
    default_email = "admin@pier11marina.com"
    default_password = "admin123"
    default_name = "Admin User"
    
    print(f"Email: {default_email}")
    print(f"Name: {default_name}")
    print(f"Password: {default_password}")
    print()
    
    return create_admin_user(default_email, default_password, default_name)


def show_manual_instructions():
    """Show manual SQL instructions as fallback"""
    print("\n📝 Manual Setup Instructions")
    print("=" * 40)
    print("If the script fails, you can create the admin user manually:")
    print()
    print("1. Connect to the database:")
    print("   psql -U pier11 -d pier11_marina")
    print()
    print("2. Insert admin user (replace the hash with a real one):")
    print("   INSERT INTO users (email, hashed_password, full_name, role, is_active, created_at)")
    print("   VALUES (")
    print("     'admin@pier11marina.com',")
    print("     '$2b$12$placeholder_hash_replace_this',")
    print("     'Admin User',")
    print("     'admin',")
    print("     true,")
    print("     NOW()")
    print("   );")
    print()
    print("3. Generate password hash in Python:")
    print("   from app.core.security import get_password_hash")
    print("   print(get_password_hash('your_password'))")


def run_comprehensive_tests():
    """Run comprehensive tests of all script functionality"""
    print("🧪 Running Comprehensive Tests")
    print("=" * 50)
    
    tests_passed = 0
    tests_failed = 0
    
    def test_case(name, test_func, *args, **kwargs):
        nonlocal tests_passed, tests_failed
        print(f"\n📋 Testing: {name}")
        try:
            result = test_func(*args, **kwargs)
            if result:
                print(f"   ✅ PASS")
                tests_passed += 1
            else:
                print(f"   ❌ FAIL")
                tests_failed += 1
        except Exception as e:
            print(f"   ❌ ERROR: {e}")
            tests_failed += 1
    
    # Test 1: Database connection
    test_case("Database Connection", check_database_connection)
    
    # Test 2: Email validation
    test_case("Valid Email", lambda: validate_email("test@example.com"))
    test_case("Invalid Email (no @)", lambda: not validate_email("invalid-email"))
    test_case("Invalid Email (no domain)", lambda: not validate_email("test@"))
    test_case("Invalid Email (no TLD)", lambda: not validate_email("test@domain"))
    
    # Test 3: Password validation
    def test_password_validation():
        valid_cases = [
            "Password123",
            "Complex1Pass",
            "MySecure123"
        ]
        invalid_cases = [
            "short",           # Too short
            "nouppercase123",  # No uppercase
            "NOLOWERCASE123",  # No lowercase
            "NoNumbers",       # No numbers
            "123456789"        # No letters
        ]
        
        for pwd in valid_cases:
            is_valid, _ = validate_password(pwd)
            if not is_valid:
                return False
        
        for pwd in invalid_cases:
            is_valid, _ = validate_password(pwd)
            if is_valid:
                return False
        
        return True
    
    test_case("Password Validation Logic", test_password_validation)
    
    # Test 4: Database user operations (read-only checks)
    def test_user_queries():
        try:
            db = SessionLocal()
            # Test basic query operations without modifying data
            user_count = db.query(User).count()
            admin_count = db.query(User).filter(User.role == UserRole.ADMIN).count()
            
            # Test that we can query user by email (should return None for non-existent)
            test_user = db.query(User).filter(User.email == "nonexistent@test.com").first()
            
            db.close()
            return True
        except Exception as e:
            print(f"      Database query error: {e}")
            return False
    
    test_case("Database User Queries", test_user_queries)
    
    # Test 5: Password hashing functionality
    def test_password_hashing():
        try:
            test_password = "TestPassword123"
            hashed = get_password_hash(test_password)
            
            # Check that hash is generated and is different from original
            if not hashed or hashed == test_password:
                return False
            
            # Check that hash starts with bcrypt prefix
            if not hashed.startswith("$2b$"):
                return False
            
            return True
        except Exception as e:
            print(f"      Password hashing error: {e}")
            return False
    
    test_case("Password Hashing", test_password_hashing)
    
    # Test 6: User enumeration (check existing users safely)
    def test_existing_users():
        try:
            db = SessionLocal()
            existing_users = db.query(User).all()
            
            print(f"      Found {len(existing_users)} existing users")
            for user in existing_users[:3]:  # Show first 3 users only
                print(f"      - {user.email} ({user.role.value})")
            
            if len(existing_users) > 3:
                print(f"      ... and {len(existing_users) - 3} more")
            
            db.close()
            return True
        except Exception as e:
            print(f"      User enumeration error: {e}")
            return False
    
    test_case("Existing Users Check", test_existing_users)
    
    # Test 7: Import verification
    def test_imports():
        try:
            # Test that all required modules can be imported
            from app.models.user import UserRole
            from app.core.security import get_password_hash
            from app.services.auth import AuthService
            
            # Test enum values
            if UserRole.ADMIN.value != "admin":
                return False
            if UserRole.STAFF.value != "staff":
                return False
            
            return True
        except Exception as e:
            print(f"      Import error: {e}")
            return False
    
    test_case("Module Imports", test_imports)
    
    # Test 8: Dry-run user creation (validation only)
    def test_dry_run_creation():
        try:
            # Test all the validation steps without actually creating a user
            test_email = "dryrun@test.com"
            test_password = "DryRun123"
            test_name = "Dry Run User"
            
            # Email validation
            if not validate_email(test_email):
                return False
            
            # Password validation
            is_valid, _ = validate_password(test_password)
            if not is_valid:
                return False
            
            # Password hashing
            hashed = get_password_hash(test_password)
            if not hashed:
                return False
            
            # Database connection check
            db = SessionLocal()
            existing = db.query(User).filter(User.email == test_email).first()
            db.close()
            
            # Should not exist (we're not creating it)
            return existing is None
            
        except Exception as e:
            print(f"      Dry run error: {e}")
            return False
    
    test_case("Dry Run User Creation", test_dry_run_creation)
    
    # Summary
    print(f"\n📊 Test Results Summary")
    print("=" * 30)
    print(f"Tests passed: {tests_passed}")
    print(f"Tests failed: {tests_failed}")
    print(f"Total tests:  {tests_passed + tests_failed}")
    
    if tests_failed == 0:
        print(f"\n🎉 All tests passed! The admin creation system is working correctly.")
        return True
    else:
        print(f"\n⚠️  {tests_failed} tests failed. Check the errors above.")
        print("Common issues:")
        print("- Database not running or not accessible")
        print("- Missing Python dependencies")
        print("- Database schema not migrated")
        print("- Permission issues")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Create initial admin user for Pier 11 Marina",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument(
        "--interactive", "-i",
        action="store_true",
        help="Interactive setup with custom credentials"
    )
    parser.add_argument(
        "--manual",
        action="store_true", 
        help="Show manual setup instructions"
    )
    parser.add_argument(
        "--test",
        action="store_true",
        help="Run comprehensive tests of all script functionality"
    )
    
    args = parser.parse_args()
    
    print("🚢 Pier 11 Marina - Admin User Setup")
    print("=" * 50)
    
    if args.test:
        success = run_comprehensive_tests()
        if not success:
            sys.exit(1)
        return
    
    if args.manual:
        show_manual_instructions()
        return
    
    if args.interactive:
        success = interactive_setup()
    else:
        success = default_setup()
    
    if not success:
        print("\n❌ Admin user creation failed")
        show_manual_instructions()
        sys.exit(1)
    
    print("\n🎉 Setup complete! Your admin user is ready.")


if __name__ == "__main__":
    main()