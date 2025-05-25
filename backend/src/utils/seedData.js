import Employee from '../models/Employee.js';
import User from '../models/User.js';

export const seedDatabase = async () => {
  try {
    // Check if data already exists
    const employeeCount = await Employee.countDocuments();
    const userCount = await User.countDocuments();

    if (employeeCount > 0 || userCount > 0) {
      console.log('Database already seeded');
      return;
    }

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@company.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();

    // Create employee user
    const employeeUser = new User({
      username: 'employee',
      email: 'employee@company.com',
      password: 'employee123',
      role: 'employee'
    });
    await employeeUser.save();

    // Create sample employees
    const sampleEmployees = [
      {
        name: "John Doe",
        age: 28,
        position: "Software Engineer",
        department: "Engineering",
        email: "john.doe@company.com",
        phone: "+1 (555) 123-4567",
        salary: 75000,
        joinDate: new Date("2022-01-15"),
        subjects: ["React", "Node.js", "JavaScript"],
        attendance: 95,
        bio: "Experienced software engineer with expertise in full-stack development.",
        createdBy: adminUser._id
      },
      {
        name: "Jane Smith",
        age: 32,
        position: "Product Manager",
        department: "Product",
        email: "jane.smith@company.com",
        phone: "+1 (555) 234-5678",
        salary: 95000,
        joinDate: new Date("2021-03-10"),
        subjects: ["Product Strategy", "Agile", "Analytics"],
        attendance: 92,
        bio: "Strategic product manager with a focus on user experience.",
        createdBy: adminUser._id
      },
      {
        name: "Mike Johnson",
        age: 35,
        position: "Senior Developer",
        department: "Engineering",
        email: "mike.johnson@company.com",
        phone: "+1 (555) 345-6789",
        salary: 85000,
        joinDate: new Date("2020-07-22"),
        subjects: ["Python", "Django", "PostgreSQL"],
        attendance: 98,
        bio: "Senior developer specializing in backend systems.",
        createdBy: adminUser._id
      },
      {
        name: "Sarah Wilson",
        age: 29,
        position: "UX Designer",
        department: "Design",
        email: "sarah.wilson@company.com",
        phone: "+1 (555) 456-7890",
        salary: 70000,
        joinDate: new Date("2022-05-18"),
        subjects: ["Figma", "User Research", "Prototyping"],
        attendance: 90,
        bio: "Creative UX designer passionate about user experiences.",
        createdBy: adminUser._id
      }
    ];

    await Employee.insertMany(sampleEmployees);
    
    console.log('Database seeded successfully');
    console.log('Admin credentials: admin@company.com / admin123');
    console.log('Employee credentials: employee@company.com / employee123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
