export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

interface UserInputData {
  email: string;
  password: string;
}

export interface UserQueryResponse {
  _id?: string;
  name: string;
  email: string;
}

export interface CreateUserInputData extends UserInputData {
  name: string;
}

export interface LoginUserInputData extends UserInputData {}

export interface LoginUserResolver {
  userInput: LoginUserInputData;
}

export interface CreateUserResolver {
  userInput: CreateUserInputData;
}

export interface GetUserResolver {
  name: string;
}

export interface AddFriendResolver {
  id: string;
}
