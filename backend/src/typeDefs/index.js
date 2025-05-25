import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Employee {
    id: ID!
    name: String!
    age: Int!
    position: String!
    department: String!
    email: String!
    phone: String!
    salary: Float!
    joinDate: String!
    subjects: [String!]!
    attendance: Float
    bio: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: Role!
    isActive: Boolean!
    createdAt: String!
  }

  enum Role {
    ADMIN
    EMPLOYEE
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input EmployeeInput {
    name: String!
    age: Int!
    position: String!
    department: String!
    email: String!
    phone: String!
    salary: Float!
    joinDate: String!
    subjects: [String!]
    attendance: Float
    bio: String
  }

  input EmployeeUpdateInput {
    name: String
    age: Int
    position: String
    department: String
    email: String
    phone: String
    salary: Float
    joinDate: String
    subjects: [String!]
    attendance: Float
    bio: String
    isActive: Boolean
  }

  input EmployeeFilterInput {
    department: String
    position: String
    minAge: Int
    maxAge: Int
    minSalary: Float
    maxSalary: Float
    search: String
    isActive: Boolean
  }

  enum SortOrder {
    ASC
    DESC
  }

  input SortInput {
    field: String!
    order: SortOrder!
  }

  type PaginationInfo {
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    currentPage: Int!
    totalPages: Int!
  }

  type EmployeeConnection {
    employees: [Employee!]!
    pageInfo: PaginationInfo!
  }

  type Query {
    # Employee Queries
    employees(
      filter: EmployeeFilterInput
      sort: SortInput
      page: Int = 1
      limit: Int = 10
    ): EmployeeConnection!
    
    employee(id: ID!): Employee
    
    # Analytics Queries (Admin only)
    employeeStats: EmployeeStats
    
    # User Queries
    me: User
  }

  type EmployeeStats {
    totalEmployees: Int!
    departmentCounts: [DepartmentCount!]!
    averageSalary: Float!
    averageAge: Float!
  }

  type DepartmentCount {
    department: String!
    count: Int!
  }

  type Mutation {
    # Authentication
    register(username: String!, email: String!, password: String!, role: Role): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    
    # Employee Mutations
    createEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: EmployeeUpdateInput!): Employee!
    deleteEmployee(id: ID!): Boolean!
    
    # Bulk operations (Admin only)
    deleteMultipleEmployees(ids: [ID!]!): Int!
  }
`;
