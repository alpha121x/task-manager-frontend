import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type CreateTaskInput = {
  assignedToId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  teamId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type CreateTeamInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  memberIds: Array<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTask: TaskPayload;
  createTeam: TeamPayload;
  deleteTask: Scalars['Boolean']['output'];
  login: AuthPayload;
  signup: AuthPayload;
  updateTask: TaskPayload;
};


export type MutationCreateTaskArgs = {
  input: CreateTaskInput;
};


export type MutationCreateTeamArgs = {
  input: CreateTeamInput;
};


export type MutationDeleteTaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationSignupArgs = {
  input: SignupInput;
};


export type MutationUpdateTaskArgs = {
  input: UpdateTaskInput;
};

export type Query = {
  __typename?: 'Query';
  getTask?: Maybe<Task>;
  getTasks: Array<Task>;
  getTeam?: Maybe<Team>;
  getTeams: Array<Team>;
  getUser?: Maybe<User>;
  me?: Maybe<User>;
};


export type QueryGetTaskArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetTasksArgs = {
  teamId: Scalars['ID']['input'];
};


export type QueryGetTeamArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};

export type SignupInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Task = {
  __typename?: 'Task';
  assignedTo: User;
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  priority: Scalars['String']['output'];
  status: Scalars['String']['output'];
  team: Team;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type TaskPayload = {
  __typename?: 'TaskPayload';
  task: Task;
};

export type Team = {
  __typename?: 'Team';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  members: Array<User>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type TeamPayload = {
  __typename?: 'TeamPayload';
  team: Team;
};

export type UpdateTaskInput = {
  assignedToId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  priority?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  role: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};


export const GetTeamsDocument = gql`
    query GetTeams {
  getTeams {
    id
    name
    description
    members {
      id
      name
      email
    }
  }
}
    `;

export function useGetTeamsQuery(options?: Omit<Urql.UseQueryArgs<GetTeamsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetTeamsQuery, GetTeamsQueryVariables>({ query: GetTeamsDocument, ...options });
};
export const GetTasksDocument = gql`
    query GetTasks($teamId: ID!) {
  getTasks(teamId: $teamId) {
    id
    title
    status
    priority
    dueDate
    assignedTo {
      name
    }
  }
}
    `;

export function useGetTasksQuery(options: Omit<Urql.UseQueryArgs<GetTasksQueryVariables>, 'query'>) {
  return Urql.useQuery<GetTasksQuery, GetTasksQueryVariables>({ query: GetTasksDocument, ...options });
};
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      id
      name
      email
      role
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const SignupDocument = gql`
    mutation Signup($input: SignupInput!) {
  signup(input: $input) {
    token
    user {
      id
      name
      email
      role
    }
  }
}
    `;

export function useSignupMutation() {
  return Urql.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument);
};