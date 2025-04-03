export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    user: {
      id: number;
      email: string;
      username: string;
      password: string; 
      createdAt: string;
    };
    article: {
      id: number;
      title: string;
      content: string;
      createdAt: string;
      author: {
        id: number;
        username: string;
      };
      topic: {
        id: number;
        name: string;
      };
    };
  }
  