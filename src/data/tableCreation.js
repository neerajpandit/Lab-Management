import pool from '../config/db.js';

export async function createTables() {


    const userDetailsQuery =`
        CREATE TABLE IF NOT EXISTS Users (
            id SERIAL PRIMARY KEY,
            fullName VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            phone VARCHAR(20) NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(20) CHECK (role IN ('admin', 'lab_owner', 'doctor', 'user')),
            status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
            is_deleted BOOLEAN DEFAULT FALSE,
            refresh_token text,
            refresh_token_expires_at TIMESTAMP,
            last_login TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const labDetailsQuery =`
        CREATE TABLE IF NOT EXISTS Labs (
            id SERIAL PRIMARY KEY,
            owner_id INT NOT NULL,
            name VARCHAR(100) NOT NULL,
            logo_url VARCHAR(255),
            contact_email VARCHAR(150) UNIQUE,
            contact_phone VARCHAR(20),
            address TEXT NOT NULL,
            city VARCHAR(100) NOT NULL,
            state VARCHAR(100) NOT NULL,
            country VARCHAR(100) NOT NULL,
            pincode VARCHAR(10) NOT NULL,
            latitude DECIMAL(10, 6), 
            longitude DECIMAL(10, 6),
            website_url VARCHAR(255),
            description TEXT,
            status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
            is_deleted BOOLEAN DEFAULT FALSE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (owner_id) REFERENCES Users(id) ON DELETE CASCADE
        );
    `;

    const doctorDetailsQuery = `
        CREATE TABLE IF NOT EXISTS Doctors (
            id SERIAL PRIMARY KEY,
            lab_id INT NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE,
            phone VARCHAR(20),
            specialization VARCHAR(100),
            experience INT ,
            status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
            is_deleted BOOLEAN DEFAULT FALSE,
            remarks TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (lab_id) REFERENCES Labs(id) ON DELETE CASCADE
        );
    `;


    const labStaffQuery = `
        CREATE TABLE IF NOT EXISTS LabStaff (
            id SERIAL PRIMARY KEY,
            lab_id INT NOT NULL,
            owner_id INT NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            role VARCHAR(50),
            email VARCHAR(150) UNIQUE,
            phone VARCHAR(20),
            password VARCHAR(255) NOT NULL,
            status VARCHAR(20) DEFAULT 'active',
            is_deleted BOOLEAN DEFAULT FALSE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (lab_id) REFERENCES Labs(id) ON DELETE CASCADE,
            FOREIGN KEY (owner_id) REFERENCES Users(id) ON DELETE CASCADE
    );`;


    const subscriptionPlansQuery =`
        CREATE TABLE IF NOT EXISTS SubscriptionPlans (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL, -- Plan name (Basic, Standard, Premium)
            price DECIMAL(10,2) NOT NULL, -- Subscription cost
            duration INT NOT NULL, -- Duration in days (e.g., 30 for monthly)
            features TEXT NOT NULL, -- JSON/Text format to store features
            discount_type VARCHAR(10) CHECK (discount_type IN ('flat', 'percentage')), 
            discount_value DECIMAL(10,2) DEFAULT 0, -- Default discount for the plan
            status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
            is_deleted BOOLEAN DEFAULT FALSE,
            remarks TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    
    const labSubscriptionQuery =`
        CREATE TABLE IF NOT EXISTS Subscriptions (
                id SERIAL PRIMARY KEY,
                owner_id INT NOT NULL,
                lab_id INT NOT NULL,
                plan_id INT NOT NULL,
                start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                end_date TIMESTAMP NOT NULL,
                status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'canceled')),
                is_deleted BOOLEAN DEFAULT FALSE,
                payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
                original_price DECIMAL(10,2) NOT NULL, 
                discount_amount DECIMAL(10,2) DEFAULT 0, -- Discount applied at checkout
                final_price DECIMAL(10,2) NOT NULL, -- Price after discount
                coupon_code VARCHAR(50), -- If a discount coupon is used
                FOREIGN KEY (owner_id) REFERENCES Users(id) ON DELETE CASCADE,
                FOREIGN KEY (lab_id) REFERENCES Labs(id) ON DELETE CASCADE,
                FOREIGN KEY (plan_id) REFERENCES SubscriptionPlans(id) ON DELETE CASCADE
        );
    `;


    const departmentQuery = `
        CREATE TABLE IF NOT EXISTS Departments (
            id SERIAL PRIMARY KEY,
            lab_id INT NOT NULL,
            department_name VARCHAR(100) NOT NULL,
            code VARCHAR(20) UNIQUE,
            sort_order INT,
            description TEXT,
            status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
            is_deleted BOOLEAN DEFAULT FALSE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (lab_id) REFERENCES Labs(id) ON DELETE CASCADE
        );
    `;

    const sample_typeQuery = `
        CREATE TABLE IF NOT EXISTS SampleTypes (
            id SERIAL PRIMARY KEY,
            lab_id INT NOT NULL,
            name VARCHAR(100) NOT NULL,
            code VARCHAR(20) UNIQUE,
            description TEXT,
            status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
            is_deleted BOOLEAN DEFAULT FALSE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (lab_id) REFERENCES Labs(id) ON DELETE CASCADE
        );
            
    `;

    const machineQuery = `
        CREATE TABLE IF NOT EXISTS Machines (
            id SERIAL PRIMARY KEY,
            lab_id INT NOT NULL,
            machine_name VARCHAR(100) NOT NULL,
            machine_code VARCHAR(20) UNIQUE,
            description TEXT,
            status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
            is_deleted BOOLEAN DEFAULT FALSE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (lab_id) REFERENCES Labs(id) ON DELETE CASCADE
        );
    `;

    const testQuery = ` 
        CREATE TABLE IF NOT EXISTS Tests (
            id SERIAL PRIMARY KEY,
            lab_id INT NOT NULL,
            name VARCHAR(100) NOT NULL,  -- Test Name (e.g., Blood Sugar, CBC)
            category VARCHAR(50) NOT NULL,  -- Test category (e.g., Blood, Urine)
            price DECIMAL(10,2) NOT NULL,  -- Test Cost
            description TEXT,  -- Test Description
            unit VARCHAR(50),  -- Measurement unit (e.g., mg/dL, mmol/L)
            min_range DECIMAL(10,2) NOT NULL,  -- Minimum Normal Range
            max_range DECIMAL(10,2) NOT NULL,  -- Maximum Normal Range
            sample_type VARCHAR(50) CHECK (sample_type IN ('blood', 'urine', 'saliva', 'other')),
            status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (lab_id) REFERENCES Labs(id) ON DELETE CASCADE
        );
    `;

    const testPackageQuery = `
        CREATE TABLE IF NOT EXISTS TestPackages (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            description TEXT,
            status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

    const packageTestQuery = `
        CREATE TABLE IF NOT EXISTS PackageTests (
            id SERIAL PRIMARY KEY,
            package_id INT NOT NULL,
            test_id INT NOT NULL,
            status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (package_id, test_id),
            FOREIGN KEY (package_id) REFERENCES TestPackages(id) ON DELETE CASCADE,
            FOREIGN KEY (test_id) REFERENCES Tests(id) ON DELETE CASCADE
        );`;

    const labTestQuery = `
        CREATE TABLE IF NOT EXISTS TestsResult (
            id SERIAL PRIMARY KEY,
            patient_id INT NOT NULL,       
            lab_id INT NOT NULL,
            assigned_by INT NOT NULL,
            test_status VARCHAR(20) DEFAULT 'pending' CHECK (test_status IN ('pending', 'completed', 'canceled')),
            test_results JSONB DEFAULT '[]'::JSONB,
            test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            sample_type VARCHAR(50) CHECK (sample_type IN ('blood', 'urine', 'saliva', 'other')) NOT NULL,
            remarks TEXT,
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (patient_id) REFERENCES Patients(id) ON DELETE CASCADE,
            FOREIGN KEY (lab_id) REFERENCES Labs(id) ON DELETE CASCADE,
            FOREIGN KEY (assigned_by) REFERENCES Users(id) ON DELETE SET NULL
        );
    `;

    const patientTestQuery = `
            CREATE TABLE IF NOT EXISTS PatientWithTest (
            id SERIAL PRIMARY KEY,
            lab_id INT NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100),
            email VARCHAR(150) UNIQUE,
            phone VARCHAR(20),
            age VARCHAR(20) NOT NULL,
            date_of_birth DATE ,
            gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')) NOT NULL,
            address TEXT,
            doctor_id INT,
            report_mode VARCHAR(20) CHECK (report_mode IN ('hand','email', 'sms','whatsapp', 'Courier')),
            blood_group VARCHAR(10) CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')),
            assigned_by INT NOT NULL,
            test_status VARCHAR(20) DEFAULT 'pending' CHECK (test_status IN ('pending', 'completed', 'canceled')),
            test_results JSONB DEFAULT '[]'::JSONB,
            test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            sample_type VARCHAR(50) CHECK (sample_type IN ('blood', 'urine', 'saliva', 'other')), 
            collection_type VARCHAR(50) CHECK (collection_type IN ('walkIn','home', 'lab', 'other')),
            remarks TEXT,
            is_deleted BOOLEAN DEFAULT FALSE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (lab_id) REFERENCES Labs(id) ON DELETE CASCADE,
            FOREIGN KEY (doctor_id) REFERENCES Doctors(id) ON DELETE SET NULL,
            FOREIGN KEY (assigned_by) REFERENCES Users(id) ON DELETE SET NULL
        );

    `;

    

    try {
        await pool.query(userDetailsQuery); 
        await pool.query(labDetailsQuery); 
        await pool.query(doctorDetailsQuery);
        await pool.query(labStaffQuery);
        await pool.query(subscriptionPlansQuery);
        await pool.query(labSubscriptionQuery);
        await pool.query(testQuery);
        await pool.query(testPackageQuery);
        await pool.query(packageTestQuery);
        await pool.query(labTestQuery);
        await pool.query(patientTestQuery);

        console.log('Tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error.stack);
    }
}

