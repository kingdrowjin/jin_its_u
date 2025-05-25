import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        role
        isActive
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register(
    $username: String!
    $email: String!
    $password: String!
    $role: Role
  ) {
    register(username: $username, email: $email, password: $password, role: $role) {
      token
      user {
        id
        username
        email
        role
        isActive
      }
    }
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($input: EmployeeInput!) {
    createEmployee(input: $input) {
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
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $input: EmployeeUpdateInput!) {
    updateEmployee(id: $id, input: $input) {
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
      updatedAt
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

export const DELETE_MULTIPLE_EMPLOYEES = gql`
  mutation DeleteMultipleEmployees($ids: [ID!]!) {
    deleteMultipleEmployees(ids: $ids)
  }
`;
