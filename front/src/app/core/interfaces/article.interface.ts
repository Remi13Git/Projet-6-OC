export interface Article {
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
  }
  