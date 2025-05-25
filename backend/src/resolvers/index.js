import Employee from '../models/Employee.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export const resolvers = {
  Query: {
    // Employee Queries
    employees: async (_, { filter = {}, sort, page = 1, limit = 10 }) => {
      try {
        // Build filter query
        const query = { isActive: true };
        
        if (filter.department) query.department = filter.department;
        if (filter.position) query.position = filter.position;
        if (filter.minAge || filter.maxAge) {
          query.age = {};
          if (filter.minAge) query.age.$gte = filter.minAge;
          if (filter.maxAge) query.age.$lte = filter.maxAge;
        }
        if (filter.minSalary || filter.maxSalary) {
          query.salary = {};
          if (filter.minSalary) query.salary.$gte = filter.minSalary;
          if (filter.maxSalary) query.salary.$lte = filter.maxSalary;
        }
        if (filter.search) {
          query.$text = { $search: filter.search };
        }
        if (filter.isActive !== undefined) {
          query.isActive = filter.isActive;
        }

        // Build sort query
        let sortQuery = { createdAt: -1 }; // Default sort
        if (sort) {
          sortQuery = { [sort.field]: sort.order === 'ASC' ? 1 : -1 };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        const totalCount = await Employee.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        // Execute query
        const employees = await Employee.find(query)
          .sort(sortQuery)
          .skip(skip)
          .limit(limit);

        return {
          employees,
          pageInfo: {
            totalCount,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            currentPage: page,
            totalPages
          }
        };
      } catch (error) {
        throw new Error(`Failed to fetch employees: ${error.message}`);
      }
    },

    employee: async (_, { id }) => {
      try {
        const employee = await Employee.findById(id);
        if (!employee) {
          throw new Error('Employee not found');
        }
        return employee;
      } catch (error) {
        throw new Error(`Failed to fetch employee: ${error.message}`);
      }
    },

    employeeStats: async (_, __, { user }) => {
      requireAdmin(user);
      
      try {
        const totalEmployees = await Employee.countDocuments({ isActive: true });
        
        const departmentCounts = await Employee.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: '$department', count: { $sum: 1 } } },
          { $project: { department: '$_id', count: 1, _id: 0 } }
        ]);

        const salaryStats = await Employee.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: null, avgSalary: { $avg: '$salary' }, avgAge: { $avg: '$age' } } }
        ]);

        return {
          totalEmployees,
          departmentCounts,
          averageSalary: salaryStats[0]?.avgSalary || 0,
          averageAge: salaryStats[0]?.avgAge || 0
        };
      } catch (error) {
        throw new Error(`Failed to fetch employee stats: ${error.message}`);
      }
    },

    me: async (_, __, { user }) => {
      return requireAuth(user);
    }
  },

  Mutation: {
    // Authentication
    register: async (_, { username, email, password, role = 'EMPLOYEE' }) => {
      try {
        const existingUser = await User.findOne({
          $or: [{ email }, { username }]
        });

        if (existingUser) {
          throw new Error('User with this email or username already exists');
        }

        // Convert GraphQL enum to lowercase for database
        const dbRole = role.toLowerCase();

        const user = new User({ username, email, password, role: dbRole });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: '7d'
        });

        return { token, user };
      } catch (error) {
        throw new Error(`Registration failed: ${error.message}`);
      }
    },

    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email, isActive: true });
        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
          throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: '7d'
        });

        return { token, user };
      } catch (error) {
        throw new Error(`Login failed: ${error.message}`);
      }
    },

    // Employee Mutations
    createEmployee: async (_, { input }, { user }) => {
      requireAuth(user);
      
      try {
        const existingEmployee = await Employee.findOne({ email: input.email });
        if (existingEmployee) {
          throw new Error('Employee with this email already exists');
        }

        const employee = new Employee({
          ...input,
          joinDate: new Date(input.joinDate),
          createdBy: user._id
        });

        await employee.save();
        return employee;
      } catch (error) {
        throw new Error(`Failed to create employee: ${error.message}`);
      }
    },

    updateEmployee: async (_, { id, input }, { user }) => {
      requireAuth(user);
      
      try {
        // Check if user can update this employee (admin or own record)
        const employee = await Employee.findById(id);
        if (!employee) {
          throw new Error('Employee not found');
        }

        if (user.role !== 'admin' && employee.createdBy.toString() !== user._id.toString()) {
          throw new Error('Unauthorized to update this employee');
        }

        const updateData = { ...input };
        if (input.joinDate) {
          updateData.joinDate = new Date(input.joinDate);
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        );

        return updatedEmployee;
      } catch (error) {
        throw new Error(`Failed to update employee: ${error.message}`);
      }
    },

    deleteEmployee: async (_, { id }, { user }) => {
      requireAuth(user);
      
      try {
        const employee = await Employee.findById(id);
        if (!employee) {
          throw new Error('Employee not found');
        }

        // Check permissions
        if (user.role !== 'admin' && employee.createdBy.toString() !== user._id.toString()) {
          throw new Error('Unauthorized to delete this employee');
        }

        // Soft delete
        await Employee.findByIdAndUpdate(id, { isActive: false });
        return true;
      } catch (error) {
        throw new Error(`Failed to delete employee: ${error.message}`);
      }
    },

    deleteMultipleEmployees: async (_, { ids }, { user }) => {
      requireAdmin(user);
      
      try {
        const result = await Employee.updateMany(
          { _id: { $in: ids } },
          { isActive: false }
        );
        return result.modifiedCount;
      } catch (error) {
        throw new Error(`Failed to delete employees: ${error.message}`);
      }
    }
  },

  // Custom scalar resolvers
  Employee: {
    joinDate: (employee) => employee.joinDate.toISOString().split('T')[0],
    createdAt: (employee) => employee.createdAt.toISOString(),
    updatedAt: (employee) => employee.updatedAt.toISOString()
  },

  User: {
    // Convert database role to GraphQL enum format
    role: (user) => user.role.toUpperCase(),
    createdAt: (user) => user.createdAt.toISOString()
  }
};
