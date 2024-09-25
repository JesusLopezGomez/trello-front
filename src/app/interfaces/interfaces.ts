export interface User {
    id:       number;
    username: string;
    email:    string;
    role:     string;
    projects: any[];
}

export interface UserLogin {
    usernameOrEmail: string;
    password: string;
}

export interface UserRegister {
    username: string;
    email:    string;
    password: string;
}

export interface Project {
    id:          number;
    name:        string;
    description: string;
    idUser:      number;
    boardDTOs:   Board[];
}

export interface Board {
    id:        number;
    name:      string;
    idProject: number;
    taskDTOs:  Task[];
}

export interface Task {
    id:          number;
    title:       string;
    description: string;
    order:       number;
    idBoard:     number;
    idUser:      number;
}
