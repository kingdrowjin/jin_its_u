import { gql } from '@apollo/client';

export const GET_EMPLOYEES = gql`
  query GetEmployees(
    $filter: EmployeeFilterInput
    $sort: SortInput
    $page: Int
    $limit: Int
  ) {
    employees(filter: $filter, sort: $sort, page: $page, limit: $limit) {
      employees {
        id
        name
        age
        position
        department
        email
        phone
        salary
        joinDate
        subjects
        attendance
        bio
        isActive
        createdAt
        updatedAt
      }
      pageInfo {
        totalCount
        hasNextPage
        hasPreviousPage
        currentPage
        totalPages
      }
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      id
      name
      age
      position
      department
      email
      phone
      salary
      joinDate
      subjects
      attendance
      bio
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_EMPLOYEE_STATS = gql`
  query GetEmployeeStats {
    employeeStats {
      totalEmployees
      departmentCounts {
        department
        count
      }
      averageSalary
      averageAge
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      role
      isActive
      createdAt
    }
  }
`;
